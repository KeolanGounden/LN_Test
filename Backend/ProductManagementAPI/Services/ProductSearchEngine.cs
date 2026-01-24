using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Collections.Concurrent;
using System.Threading;

using ProductManagementAPI.Interfaces;

namespace ProductManagementAPI.Services
{
    /// <summary>
    /// Generic in-memory search engine that supports fuzzy matching and weighted multi-field scoring.
    /// Usage: provide a collection of items and one or more field selectors with weights.
    /// </summary>
    public class ProductSearchEngine<T> : IProductSearchEngine<T>
    {
        private readonly List<T> _items = new();
        private readonly List<(Func<T, string> selector, double weight, string name)> _fields = new();
        private readonly List<IndexedItem> _index = new();
        // Simple in-memory cache for search results keyed by normalized query + parameters + dataset version
        private readonly ConcurrentDictionary<string, CachedResult> _searchCache = new();
        private readonly object _cacheLock = new();
        private readonly int _cacheMaxItems = 1000;
        private readonly TimeSpan _cacheDuration = TimeSpan.FromMinutes(5);
        private long _datasetVersion = 0; // increment when items/fields change

        private static readonly Regex _normalizeRegex = new("[^a-z0-9 ]", RegexOptions.Compiled);

        public ProductSearchEngine(IEnumerable<T> items, IEnumerable<(Func<T, string> selector, double weight, string name)>? fields = null)
        {
            if (items != null)
                _items.AddRange(items);

            if (fields != null)
                _fields.AddRange(fields);

            // If no fields provided, try to use ToString()
            if (!_fields.Any())
            {
                _fields.Add((x => x?.ToString() ?? string.Empty, 1.0, "__default"));
            }
            BuildIndex();
        }

        // parameterless ctor to support DI creation; call ReplaceAll to load items before searching
        public ProductSearchEngine()
        {
        }

        /// <summary>
        /// Add an item to the engine and index it.
        /// </summary>
        public void Add(T item)
        {
            _items.Add(item);
            var idx = BuildIndexedItem(item);
            _index.Add(idx);
            Interlocked.Increment(ref _datasetVersion);
            // lightweight cache eviction of stale entries; don't clear entire cache
            PruneCache();
        }

        // Update an existing item in-place (requires equality by reference or external lookup)
        public void Update(T oldItem, T newItem)
        {
            var idx = _items.IndexOf(oldItem);
            if (idx >= 0)
            {
                _items[idx] = newItem;
                _index[idx] = BuildIndexedItem(newItem);
                Interlocked.Increment(ref _datasetVersion);
                PruneCache();
            }
        }

        public void Remove(T item)
        {
            var idx = _items.IndexOf(item);
            if (idx >= 0)
            {
                _items.RemoveAt(idx);
                _index.RemoveAt(idx);
                Interlocked.Increment(ref _datasetVersion);
                PruneCache();
            }
        }

        /// <summary>
        /// Replace the entire dataset and rebuild the index.
        /// </summary>
        public void ReplaceAll(IEnumerable<T> items)
        {
            _items.Clear();
            _items.AddRange(items);
            BuildIndex();
            Interlocked.Increment(ref _datasetVersion);
            PruneCache();
        }

        /// <summary>
        /// Perform a search for the provided query returning up to maxResults results ordered by score descending.
        /// </summary>
        public IEnumerable<SearchResult<T>> Search(string query, int maxResults = 20, double minScore = 0.05)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Enumerable.Empty<SearchResult<T>>();
            var q = Normalize(query);
            var qTokens = Tokenize(q);

            var cacheKey = BuildCacheKey(q, maxResults, minScore, Interlocked.Read(ref _datasetVersion));
            if (_searchCache.TryGetValue(cacheKey, out var cached) && DateTime.UtcNow - cached.Created <= _cacheDuration)
            {
                return cached.Results;
            }

            var results = ScoreIndex(_index, q, qTokens, maxResults, minScore);

            var final = results
                .OrderByDescending(r => r.Score)
                .ThenBy(r => r.Item?.ToString())
                .Take(maxResults)
                .ToList();

            _searchCache[cacheKey] = new CachedResult { Created = DateTime.UtcNow, Results = final };
            PruneCacheIfNeeded();

            return final;
        }

        // Non-mutating search against a provided candidate set. Does not replace engine dataset or rebuild index.
        public IEnumerable<SearchResult<T>> Search(IEnumerable<T> candidates, string query, int maxResults = 20, double minScore = 0.05)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Enumerable.Empty<SearchResult<T>>();

            var q = Normalize(query);
            var qTokens = Tokenize(q);

            // compute a cache key that includes the dataset version so entries are invalidated when dataset changes
            var cacheKey = BuildCacheKey(q, maxResults, minScore, Interlocked.Read(ref _datasetVersion));
            if (_searchCache.TryGetValue(cacheKey, out var cached) && DateTime.UtcNow - cached.Created <= _cacheDuration)
            {
                return cached.Results;
            }

            // build temporary indexed items for candidates only (avoid mutating engine state)
            var tempIndexed = new List<IndexedItem>();
            foreach (var c in candidates)
                tempIndexed.Add(BuildIndexedItem(c));

            var results = ScoreIndex(tempIndexed, q, qTokens, maxResults, minScore);

            var final = results
                .OrderByDescending(r => r.Score)
                .ThenBy(r => r.Item?.ToString())
                .Take(maxResults)
                .ToList();

            _searchCache[cacheKey] = new CachedResult { Created = DateTime.UtcNow, Results = final };
            PruneCacheIfNeeded();

            return final;
        }

        private static string BuildCacheKey(string q, int maxResults, double minScore, long version)
        {
            return $"{version}:{q}|{maxResults}|{minScore:0.000}";
        }

        private void PruneCache()
        {
            // remove entries older than duration
            var threshold = DateTime.UtcNow - _cacheDuration;
            foreach (var kv in _searchCache.Where(kv => kv.Value.Created < threshold).ToList())
                _searchCache.TryRemove(kv.Key, out _);
            PruneCacheIfNeeded();
        }

        private void PruneCacheIfNeeded()
        {
            if (_searchCache.Count <= _cacheMaxItems) return;
            lock (_cacheLock)
            {
                if (_searchCache.Count <= _cacheMaxItems) return;
                var removeCount = _searchCache.Count - _cacheMaxItems;
                var oldest = _searchCache.OrderBy(kv => kv.Value.Created).Take(removeCount).Select(kv => kv.Key).ToList();
                foreach (var k in oldest)
                    _searchCache.TryRemove(k, out _);
            }
        }

        private List<SearchResult<T>> ScoreIndex(List<IndexedItem> indexToScore, string q, string[] qTokens, int maxResults, double minScore)
        {
            var results = new List<SearchResult<T>>();
            foreach (var indexed in indexToScore)
            {
                double score = 0.0;

                for (int f = 0; f < _fields.Count; f++)
                {
                    var fieldText = indexed.FieldTexts[f];
                    var fieldTokens = indexed.FieldTokens[f];
                    var weight = _fields[f].weight;

                    if (fieldText == q)
                    {
                        score += weight * 1.0;
                        continue;
                    }

                    double bestForField = 0.0;
                    foreach (var qt in qTokens)
                    {
                        foreach (var ft in fieldTokens)
                        {
                            if (ft == qt)
                            {
                                bestForField = Math.Max(bestForField, 1.0);
                                continue;
                            }

                            if (ft.Contains(qt))
                            {
                                bestForField = Math.Max(bestForField, 0.85);
                                continue;
                            }

                            var sim = Similarity(qt, ft);
                            if (sim > 0.55)
                            {
                                bestForField = Math.Max(bestForField, 0.5 * sim);
                            }
                        }
                    }

                    var wholeSim = Similarity(q, fieldText);
                    if (wholeSim > 0.6)
                        bestForField = Math.Max(bestForField, wholeSim * 0.9);

                    score += bestForField * weight;
                }

                if (score >= minScore)
                {
                    results.Add(new SearchResult<T>(indexed.Item, score));
                }
            }

            return results;
        }

        /// <summary>
        /// Configure which fields are used for scoring. Call before BuildIndex if you want custom fields.
        /// </summary>
        public void ConfigureFields(IEnumerable<(Func<T, string> selector, double weight, string name)> fields)
        {
            _fields.Clear();
            _fields.AddRange(fields);
            if (!_fields.Any())
                _fields.Add((x => x?.ToString() ?? string.Empty, 1.0, "__default"));
            // fields changed -> rebuild index and invalidate cache
            BuildIndex();
            _searchCache.Clear();
        }

        private void BuildIndex()
        {
            _index.Clear();
            // index rebuild invalidates search cache
            _searchCache.Clear();
            foreach (var item in _items)
                _index.Add(BuildIndexedItem(item));
        }

        private class CachedResult
        {
            public DateTime Created { get; set; }
            public List<SearchResult<T>> Results { get; set; } = new();
        }

        private IndexedItem BuildIndexedItem(T item)
        {
            var fieldTexts = new List<string>();
            var fieldTokens = new List<string[]>();

            foreach (var (selector, weight, name) in _fields)
            {
                var raw = selector(item) ?? string.Empty;
                var norm = Normalize(raw);
                var tokens = Tokenize(norm);
                fieldTexts.Add(norm);
                fieldTokens.Add(tokens);
            }

            return new IndexedItem
            {
                Item = item,
                FieldTexts = fieldTexts.ToArray(),
                FieldTokens = fieldTokens.ToArray()
            };
        }

        private static string Normalize(string input)
        {
            if (string.IsNullOrEmpty(input))
                return string.Empty;

            input = input.Normalize(NormalizationForm.FormKD);
            var sb = new StringBuilder();
            foreach (var ch in input)
            {
                var cat = CharUnicodeInfo.GetUnicodeCategory(ch);
                if (cat == UnicodeCategory.NonSpacingMark)
                    continue;
                sb.Append(ch);
            }

            var lowered = sb.ToString().ToLowerInvariant();
            // keep only a-z0-9 and spaces
            lowered = _normalizeRegex.Replace(lowered, " ");
            // collapse spaces
            lowered = Regex.Replace(lowered, "\\s+", " ").Trim();
            return lowered;
        }

        private static string[] Tokenize(string normalized)
        {
            if (string.IsNullOrWhiteSpace(normalized))
                return Array.Empty<string>();
            return normalized.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        }

        // Normalized similarity between two tokens [0..1]. Uses Levenshtein distance normalized by length.
        private static double Similarity(string a, string b)
        {
            if (string.IsNullOrEmpty(a) && string.IsNullOrEmpty(b))
                return 1.0;
            if (string.IsNullOrEmpty(a) || string.IsNullOrEmpty(b))
                return 0.0;

            if (a == b)
                return 1.0;

            var dist = Levenshtein(a, b);
            var max = Math.Max(a.Length, b.Length);
            if (max == 0) return 0.0;
            var sim = 1.0 - (double)dist / max;
            return Math.Max(0.0, Math.Min(1.0, sim));
        }

        // classic iterative Levenshtein distance
        private static int Levenshtein(string a, string b)
        {
            var n = a.Length;
            var m = b.Length;
            if (n == 0) return m;
            if (m == 0) return n;

            // swap to use less space
            if (n > m)
            {
                var tmp = a; a = b; b = tmp;
                n = a.Length; m = b.Length;
            }

            var previous = new int[n + 1];
            var current = new int[n + 1];

            for (int i = 0; i <= n; i++) previous[i] = i;

            for (int j = 1; j <= m; j++)
            {
                current[0] = j;
                char bj = b[j - 1];
                for (int i = 1; i <= n; i++)
                {
                    var cost = a[i - 1] == bj ? 0 : 1;
                    var insert = previous[i] + 1;
                    var delete = current[i - 1] + 1;
                    var replace = previous[i - 1] + cost;
                    current[i] = Math.Min(Math.Min(insert, delete), replace);
                }
                // swap
                var tmpRow = previous;
                previous = current;
                current = tmpRow;
            }

            return previous[n];
        }

        private class IndexedItem
        {
            public T Item { get; set; } = default!;
            public string[] FieldTexts { get; set; } = Array.Empty<string>();
            public string[][] FieldTokens { get; set; } = Array.Empty<string[]>();
        }
    }
}
