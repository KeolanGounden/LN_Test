using ProductManagementAPI.Extensions;
using ProductManagementAPI.Models;
using ChangeTrackerModel.Models.Data;
using ChangeTrackerModel.Models.Entities;

namespace ProductManagementAPI.Interfaces
{
    public interface IPlatformContentService
    {
       public Task<PagedResult<TakealotContentResponse>> SearchTakealot(TakealotSearchRequest takealotSearchRequest, CancellationToken cancellationToken);


    }
}
