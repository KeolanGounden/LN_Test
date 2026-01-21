using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChangeTrackerModel.Utlis
{
    public static class TimeUtils
    {
        public static long ToEpochSeconds(DateTime dateTime)
        {
            DateTimeOffset offset = DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
            return offset.ToUnixTimeSeconds();
        }

        public static DateTime FromInfluxNanoseconds(long unixNanoseconds)
        {
            // Convert nanoseconds to ticks (1 tick = 100 ns)
            long ticks = unixNanoseconds / 100;
            DateTime epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            return epoch.AddTicks(ticks);
        }

        public static long FromNanoToEpochSeconds(long nanoseconds)
        {
            return nanoseconds / 1_000_000_000;
        }
    }
}
