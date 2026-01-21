using ChangeTrackerAPI.Exceptions;
using ChangeTrackerAPI.Extensions;
using ChangeTrackerAPI.Interfaces;
using ChangeTrackerAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.RegularExpressions;

namespace ChangeTrackerAPI.Controllers
{
    [Route("api/platform-content")]
    public class PlatformContentController : Controller
    {
        private IPlatformContentService _platformContentService;

        public PlatformContentController(IPlatformContentService platformContentService)
        {
            _platformContentService = platformContentService;
    
        }


        [HttpPost("populate-takealot")]
        public async Task<ActionResult> PopulateTakealot([FromBody] TakealotPopulateRequest target)
        {
            if (target.StartIndex > 0 && target.EndIndex <= 99999999)
            {
                await _platformContentService.PopulateTakealot(target.StartIndex, target.EndIndex);
            }
            else
            {
                await _platformContentService.PopulateTakealot(1, 99999999);
            }

            return Ok();
        }

    


        [HttpPost("search-takealot")]
        [ProducesResponseType(typeof(PagedResult<TakealotContentResponse>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PagedResult<TakealotContentResponse>>> SearchTakealot(
        [FromBody] TakealotSearchRequest request,
        CancellationToken cancellationToken)
        {
            try
            {
                var result = await _platformContentService.SearchTakealot(request, cancellationToken);
                return Ok(result);
            }
            catch (OperationCanceledException)
            {
                return StatusCode(StatusCodes.Status499ClientClosedRequest, "Request was cancelled.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }




    }
}
