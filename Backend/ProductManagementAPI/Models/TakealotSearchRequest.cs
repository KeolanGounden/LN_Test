using ChangeTrackerAPI.Extensions;
using System.Text.Json.Serialization;

namespace ChangeTrackerAPI.Models
{
    public record TakealotSearchRequest : PaginationParams
    {
        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("last_updated_start")]
        public DateTime? LastUpdatedStart { get; set; }

        [JsonPropertyName("last_updated_end")]
        public DateTime? LastUpdatedEnd { get; set; }

        [JsonPropertyName("product_id")]
        public string? ProductId { get; set; }

        [JsonPropertyName("in_stock")]
        public bool? InStock { get; set; }

    }
}
