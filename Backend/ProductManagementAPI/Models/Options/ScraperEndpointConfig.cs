using System.Text.Json.Serialization;

namespace ChangeTrackerAPI.Models.Options
{
    public class ScraperEndpointConfig
    {
        [JsonPropertyName("EndpointUrl")]
        public string Url { get; set; }

        [JsonPropertyName("ScrapeTopic")]
        public string ScrapeTopic { get; set; } = "takealot-chart-scrape";

        [JsonPropertyName("ScrapePubSub")]
        public string ScrapePubSub { get; set; } = "pubsub-rabbit";
    }
}
