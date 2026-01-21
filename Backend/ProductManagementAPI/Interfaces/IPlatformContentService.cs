using ChangeTrackerAPI.Extensions;
using ChangeTrackerAPI.Models;
using ChangeTrackerModel.Models.Data;
using ChangeTrackerModel.Models.Entities;

namespace ChangeTrackerAPI.Interfaces
{
    public interface IPlatformContentService
    {
       public Task PopulateTakealot(long start = 1, long target = 99999999);
       public Task<PagedResult<TakealotContentResponse>> SearchTakealot(TakealotSearchRequest takealotSearchRequest, CancellationToken cancellationToken);
       public Task CleanTakealot(string plid);
      
    }
}
