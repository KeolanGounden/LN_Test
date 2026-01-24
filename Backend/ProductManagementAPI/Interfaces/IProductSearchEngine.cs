using System;
using System.Collections.Generic;

namespace ProductManagementAPI.Interfaces
{
    public record SearchResult<T>(T Item, double Score);

    public interface IProductSearchEngine<T>
    {
        IEnumerable<SearchResult<T>> Search(string query, int maxResults = 20, double minScore = 0.05);
        IEnumerable<SearchResult<T>> Search(IEnumerable<T> candidates, string query, int maxResults = 20, double minScore = 0.05);
        void Add(T item);
        void ReplaceAll(IEnumerable<T> items);
        void ConfigureFields(IEnumerable<(Func<T, string> selector, double weight, string name)> fields);
    }
}
