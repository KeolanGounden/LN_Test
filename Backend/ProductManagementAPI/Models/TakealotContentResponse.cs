namespace ProductManagementAPI.Models
{
    public record TakealotContentResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime LastUpdated { get; set; }
        public string Url { get; set; }
        public string ProductIdentifier { get; set; }
        public bool InStock { get; set; }
    }
}
