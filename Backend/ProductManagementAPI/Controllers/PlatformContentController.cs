using ProductManagementAPI.Extensions;
using ProductManagementAPI.Interfaces;
using ProductManagementAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.RegularExpressions;

namespace ProductManagementAPI.Controllers
{
    [Route("api/platform-content")]
    public class PlatformContentController : Controller
    {
        private IPlatformContentService _platformContentService;

        public PlatformContentController(IPlatformContentService platformContentService)
        {
            _platformContentService = platformContentService;
    
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
