using Microsoft.EntityFrameworkCore;

namespace ChangeTrackerAPI.Extensions
{
    public static class IQueryableExtensions
    {
        public static async Task<PagedResult<T>> ToPagedResultAsync<T>(
            this IQueryable<T> query, PaginationParams pagination, CancellationToken ct = default)
        {
            var totalCount = await query.CountAsync(ct);
            var items = await query
                .Skip((pagination.PageNumber) * pagination.PageSize)
                .Take(pagination.PageSize)
                .ToListAsync(ct);

            return new PagedResult<T>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pagination.PageNumber,
                PageSize = pagination.PageSize
            };
        }


        public static async Task<KeysetResult<T>> ToKeysetPagedResultAsync<T>(
           this IQueryable<T> query, KeysetParams pagination, CancellationToken ct = default)
        {
            var totalCount = await query.CountAsync(ct);
            var items = await query
                .Take(pagination.PageSize)
                .ToListAsync(ct);

            return new KeysetResult<T>
            {
                Items = items,
                TotalCount = totalCount,
                LastItem = items.Last(),
                PageSize = pagination.PageSize
            };
        }

    }

    public record PaginationParams
    {
        private int _pageNumber = 0;
        private int _pageSize = 10;

        public int PageNumber
        {
            get => _pageNumber;
            set => _pageNumber = value >= 0 ? value : 0;
        }

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = value > 0 ? value : 10;
        }

        public string? SortBy { get; set; }
        public bool Descending { get; set; } = false;
    }

    public record PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }


    public record KeysetParams
    {
        private int _pageSize = 10;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = value > 0 ? value : 10;
        }

        public bool Descending { get; set; } = false;

    }

    public record KeysetResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageSize { get; set; }
        public T LastItem { get; set; }
    }
}
