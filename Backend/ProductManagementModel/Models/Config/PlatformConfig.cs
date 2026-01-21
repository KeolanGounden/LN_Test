using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChangeTrackerModel.Models.Config
{
    public class PlatformConfig
    {
        public string TakealotApiUrl { get; set; } = "https://api.takealot.com/rest/v-1-13-0";
        public string TakealotPlatformStore { get; set; } = "takealot-store";
    }
}
