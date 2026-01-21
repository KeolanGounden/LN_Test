namespace ChangeTrackerAPI.Exceptions
{
    public class MetricNotFoundException : Exception
    {
        public MetricNotFoundException() : base(string.Format("Metric telemery data not found"), new Exception())
        {

        }
    }
}
