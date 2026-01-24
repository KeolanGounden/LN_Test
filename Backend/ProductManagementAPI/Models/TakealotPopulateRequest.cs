namespace ProductManagementAPI.Models
{
    public record TakealotPopulateRequest
    {
        public long StartIndex {  get; set; }
        public long EndIndex { get; set; }
    }

}
