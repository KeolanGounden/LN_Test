using ProductManagementAPI.Extensions;
using ProductManagementAPI.Models;
using ChangeTrackerModel.Models.Data;
using ChangeTrackerModel.Models.Entities;

namespace ProductManagementAPI.Interfaces
{
    public interface IPlatformContentService
    {
       public Task PopulateTakealot(long start = 1, long target = 99999999);
       public Task<PagedResult<TakealotContentResponse>> SearchTakealot(TakealotSearchRequest takealotSearchRequest, CancellationToken cancellationToken);
       public Task CleanTakealot(string plid);
      
    }
}
