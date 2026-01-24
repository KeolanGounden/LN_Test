using ProductManagementAPI.Extensions;
using ProductManagementAPI.Interfaces;
using ProductManagementAPI.Models;
using ChangeTrackerModel.DatabaseContext;
using ChangeTrackerModel.Models.Config;
using ChangeTrackerModel.Models.Data;
using ChangeTrackerModel.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text.Json;
using ProductManagementAPI.Services;


namespace ProductManagementAPI.Services
{
    public class PlatformContentService : IPlatformContentService
    {
        private HttpClient _httpClient;
        private readonly MySqlContext _context;
        private ILogger<PlatformContentService> _logger;
        private PlatformConfig _platformConfig;
        private readonly IProductSearchEngine<PlatformContentTakealotEntity> _searchEngine;

        public PlatformContentService(MySqlContext context, ILogger<PlatformContentService> logger, IHttpClientFactory httpClientFactory, IOptions<PlatformConfig> platformConfig, IProductSearchEngine<PlatformContentTakealotEntity> searchEngine)
        {
            _context = context;
            _logger = logger;
            _httpClient = httpClientFactory.CreateClient();
            _platformConfig = platformConfig.Value;
            _searchEngine = searchEngine;
            // configure searchable fields once to avoid reconfiguring (which rebuilds index) on each request
            var fields = new (Func<PlatformContentTakealotEntity, string> selector, double weight, string name)[]
            {
                (p => p.Name ?? string.Empty, 1.0, "name"),
                (p => p.ProductIdentifier ?? string.Empty, 0.6, "id")
            };
            _searchEngine.ConfigureFields(fields);

        }


        public async Task PopulateTakealot(long start = 1,long target = 99999999)
        {
            try 
            {
                _logger.LogInformation($"Starting Takealot Scraping: {target}");

                

                for (var i = start; i <= target; i++)
                {

                    var plid = i.ToString("00000000");

                    await AddTakealotToDatabase(plid);

                }
                _logger.LogInformation($"Finished Takealot Scraping: {target}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error: {ex.Message}");
            }
           


        }


        public async Task CleanTakealot(string plid)
        {

            var itemFound = await _context.PlatformContentTakealot.AsNoTracking().AnyAsync(x => x.ProductIdentifier == plid);

            var lastItem = await _context.PlatformContentTakealot.AsNoTracking().OrderBy(x => x.ProductIdentifier).LastAsync();

            var isLastItem = false;

            var request = new KeysetParams()
            {
                PageSize = 1000,
            };

          

          
            while(!isLastItem)
            {
                var query = _context.PlatformContentTakealot.AsNoTracking();

                if (itemFound)
                {
                    query = query.OrderBy(b => b.ProductIdentifier).Where(x => string.Compare(x.ProductIdentifier, plid) >= 0);
                }
                var res = await query.ToKeysetPagedResultAsync(request);

                foreach (var product in res.Items)
                {
                    var item = await _context.PlatformContentTakealot.FirstAsync(x => x.Id == product.Id);

                    var productDetails = JsonSerializer.Deserialize<TakealotProductDetails>(item.MetaRaw);

                    item.MetaRaw = JsonSerializer.Serialize(productDetails);
                    item.InStock = productDetails.event_data.documents.product.in_stock;

                    await _context.SaveChangesAsync();
                }

                if(res.LastItem.Id == lastItem.Id)
                {
                    isLastItem = true;
                }

                plid = res.LastItem.ProductIdentifier;

                _logger.LogInformation($"Last PLID: {plid}");

            }
            

        }
        



        private async Task<bool> AddTakealotToDatabase(string plid)
        {

           
            var url = $"{_platformConfig.TakealotApiUrl}/product-details/PLID{plid}";

            var itemFound = await _context.PlatformContentTakealot.AnyAsync(x => x.ProductIdentifier == plid);

            if (!itemFound)
            {
                Task.Delay(100).Wait(); // Delay to avoid hitting API rate limits


                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, url);

                request.Headers.Add("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7");
                request.Headers.Add("accept-language", "en-ZA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7");
                request.Headers.Add("cache-control", "no-cache");
                request.Headers.Add("if-none-match", "W/\"ca6BxjYqcfDPvKHg7n31BQ\"");
                request.Headers.Add("priority", "u=0, i");
                request.Headers.Add("sec-ch-ua", "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"");
                request.Headers.Add("sec-ch-ua-mobile", "?0");
                request.Headers.Add("sec-ch-ua-platform", "\"Windows\"");
                request.Headers.Add("sec-fetch-dest", "document");
                request.Headers.Add("sec-fetch-mode", "navigate");
                request.Headers.Add("sec-fetch-site", "none");
                request.Headers.Add("sec-fetch-user", "?1");
                request.Headers.Add("upgrade-insecure-requests", "1");
                request.Headers.Add("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36");


                HttpResponseMessage response = await _httpClient.SendAsync(request);


                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var productDetails = JsonSerializer.Deserialize<TakealotProductDetails>(content);

                    var inStock = productDetails.event_data.documents.product.in_stock;

                    var productEntity = new PlatformContentTakealotEntity
                    {

                        Name = productDetails.title,
                        Url = productDetails.desktop_href,
                        ProductIdentifier = plid,
                        LastUpdated = DateTime.UtcNow,
                        InStock = inStock,
                        MetaRaw = inStock ? JsonSerializer.Serialize(productDetails) : JsonSerializer.Serialize(new { })
                    };

                    await _context.PlatformContentTakealot.AddAsync(productEntity);

                    await _context.SaveChangesAsync();

                    
         
                    return true;

                }
                else if (response.StatusCode != System.Net.HttpStatusCode.Forbidden)
                {
                    _logger.LogWarning($"Product not found for PLID: {plid} - Status Code: {response.StatusCode}");
                    return false;
                }
                else
                {
                    _logger.LogWarning($"Request Forbidden");
                    return false;

                }

            }
            else
            {
                _logger.LogInformation($"Product already exists for PLID: {plid}");
                return false;
            }

        }

        public async Task<PagedResult<TakealotContentResponse>> SearchTakealot(TakealotSearchRequest request, CancellationToken cancellationToken)
        {
            // Build base query with filters other than name
            var query = _context.PlatformContentTakealot.AsNoTracking();

            if (request.LastUpdatedStart != null && request.LastUpdatedEnd != null)
            {
                query = query.Where(x => x.LastUpdated.Date <= request.LastUpdatedEnd && x.LastUpdated.Date >= request.LastUpdatedStart);
            }

            if (request.ProductId != null)
            {
                query = query.Where(x => x.ProductIdentifier.Contains(request.ProductId));
            }

            if (request.InStock != null)
            {
                query = query.Where(x => x.InStock == request.InStock);
            }

            // If no name provided, fall back to database paging
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                // apply sorting to the database query according to request.SortBy / request.Descending
                query = request.SortBy?.ToLowerInvariant() switch
                {
                    "name" => request.Descending ? query.OrderByDescending(x => x.Name) : query.OrderBy(x => x.Name),
                    "lastupdated" => request.Descending ? query.OrderByDescending(x => x.LastUpdated) : query.OrderBy(x => x.LastUpdated),
                    "productidentifier" => request.Descending ? query.OrderByDescending(x => x.ProductIdentifier) : query.OrderBy(x => x.ProductIdentifier),
                    "instock" => request.Descending ? query.OrderByDescending(x => x.InStock) : query.OrderBy(x => x.InStock),
                    _ => request.Descending ? query.OrderByDescending(x => x.ProductIdentifier) : query.OrderBy(x => x.ProductIdentifier),
                };

                var result = query.Select(e => new TakealotContentResponse()
                {
                    Id = e.Id,
                    Name = e.Name,
                    LastUpdated = e.LastUpdated,
                    Url = e.Url,
                    ProductIdentifier = e.ProductIdentifier,
                    InStock = e.InStock
                });

                return await result.ToPagedResultAsync(request, cancellationToken);
            }

            var candidates = await query.OrderBy(x => x.ProductIdentifier)
                .Select(e => new PlatformContentTakealotEntity
                {
                    Id = e.Id,
                    Name = e.Name,
                    LastUpdated = e.LastUpdated,
                    Url = e.Url,
                    ProductIdentifier = e.ProductIdentifier,
                    InStock = e.InStock
                })
                .ToListAsync(cancellationToken);

            cancellationToken.ThrowIfCancellationRequested();

            // use injected search engine instance: perform non-mutating search against candidates to avoid rebuilding engine state
            var searchResults = _searchEngine.Search(candidates, request.Name ?? string.Empty, maxResults: candidates.Count()).ToList();

            // sort in-memory results: primary by score desc, then by requested sort field (or IComparable fallback)
            searchResults.Sort((a, b) =>
            {
                var scoreCmp = b.Score.CompareTo(a.Score); // higher score first
                if (scoreCmp != 0) return scoreCmp;

                // tie-breaker using request.SortBy
                var sortBy = request.SortBy?.ToLowerInvariant();
                var desc = request.Descending;

                int fieldCmp = 0;
                switch (sortBy)
                {
                    case "name":
                        fieldCmp = string.Compare(a.Item?.Name, b.Item?.Name, StringComparison.OrdinalIgnoreCase);
                        break;
                    case "lastupdated":
                        DateTime? aDate = a.Item?.LastUpdated;
                        DateTime? bDate = b.Item?.LastUpdated;
                        if (aDate == bDate) fieldCmp = 0;
                        else if (aDate == null) fieldCmp = -1;
                        else if (bDate == null) fieldCmp = 1;
                        else fieldCmp = aDate.Value.CompareTo(bDate.Value);
                        break;
                    case "productidentifier":
                        fieldCmp = string.Compare(a.Item?.ProductIdentifier, b.Item?.ProductIdentifier, StringComparison.OrdinalIgnoreCase);
                        break;
                    case "instock":
                        fieldCmp = a.Item.InStock.CompareTo(b.Item.InStock);
                        break;
                    default:
                        // try IComparable fallback on the entity
                        if (a.Item is IComparable<PlatformContentTakealotEntity> && b.Item is PlatformContentTakealotEntity)
                        {
                            fieldCmp = ((IComparable<PlatformContentTakealotEntity>)a.Item).CompareTo(b.Item);
                        }
                        else if (a.Item is IComparable && b.Item is IComparable)
                        {
                            fieldCmp = ((IComparable)a.Item).CompareTo(b.Item);
                        }
                        else
                        {
                            fieldCmp = string.Compare(a.Item?.ToString(), b.Item?.ToString(), StringComparison.OrdinalIgnoreCase);
                        }
                        break;
                }

                return desc ? -fieldCmp : fieldCmp;
            });

            var total = searchResults.Count;

            // Apply paging to results
            var paged = searchResults
                .Skip(request.PageNumber * request.PageSize)
                .Take(request.PageSize)
                .Select(r => new TakealotContentResponse
                {
                    Id = r.Item.Id,
                    Name = r.Item.Name,
                    LastUpdated = r.Item.LastUpdated,
                    Url = r.Item.Url,
                    ProductIdentifier = r.Item.ProductIdentifier,
                    InStock = r.Item.InStock
                })
                .ToList();

            return new PagedResult<TakealotContentResponse>
            {
                Items = paged,
                TotalCount = total,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }
    }
}
