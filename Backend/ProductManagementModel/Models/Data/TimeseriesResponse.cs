namespace ProductManagementAPI.Models
{
    public class TimeseriesData
    {
        public List<Point> Points { get; set; }
        public string Name { get; set; }

    }

    public class Point
    {
        public long X { get; set; }
        public float? Y { get; set; }
        public string? FormattedValue { get; set; }

    }
}
