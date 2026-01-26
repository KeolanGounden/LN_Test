using Microsoft.AspNetCore.Mvc;
using ProductManagementAPI.Extensions;
using System.Text.Json.Serialization;

namespace ProductManagementAPI.Models
{
    public record ProductSearchRequest : PaginationParams
    {

        [FromQuery(Name = "name")]
        public string? Name { get; set; }

        [FromQuery(Name = "category_id")]
        public Guid? categoryId { get; set; }

        [FromQuery(Name = "last_updated_start")]
        public DateTime? LastUpdatedStart { get; set; }

        [FromQuery(Name = "last_updated_end")]
        public DateTime? LastUpdatedEnd { get; set; }

        [FromQuery(Name = "sku")]
        public string? SKU { get; set; }

        [FromQuery(Name = "in_stock")]
        public bool? InStock { get; set; }

    }
}
