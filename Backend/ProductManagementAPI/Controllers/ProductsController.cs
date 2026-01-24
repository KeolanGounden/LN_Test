using Microsoft.AspNetCore.Mvc;
using ProductManagementAPI.Extensions;
using ProductManagementAPI.Models;
using ChangeTrackerModel.Models.Entities;
using ChangeTrackerModel.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using ProductManagementAPI.Interfaces;

namespace ProductManagementAPI.Controllers
{
    [Route("api/products")]
    public class ProductsController : Controller
    {
        private readonly MySqlContext _context;

        public ProductsController(MySqlContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? name, [FromQuery] Guid? categoryId, [FromQuery] int pageNumber = 0, [FromQuery] int pageSize = 10)
        {
            var query = _context.PlatformContentTakealot.AsNoTracking().AsQueryable();
            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(p => EF.Functions.Like(p.Name, $"%{name}%"));

            // category filtering is not implemented on PlatformContentTakealotEntity; placeholder to show filter param
            var total = await query.CountAsync();
            var items = await query.OrderBy(p => p.ProductIdentifier).Skip(pageNumber * pageSize).Take(pageSize).Select(e => new TakealotContentResponse
            {
                Id = e.Id,
                Name = e.Name,
                LastUpdated = e.LastUpdated,
                Url = e.Url,
                ProductIdentifier = e.ProductIdentifier,
                InStock = e.InStock
            }).ToListAsync();

            return Ok(new PagedResult<TakealotContentResponse> { Items = items, TotalCount = total, PageNumber = pageNumber, PageSize = pageSize });
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var item = await _context.PlatformContentTakealot.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(new TakealotContentResponse { Id = item.Id, Name = item.Name, LastUpdated = item.LastUpdated, Url = item.Url, ProductIdentifier = item.ProductIdentifier, InStock = item.InStock });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TakealotContentResponse request)
        {
            if (request is null)
                return BadRequest("Request body is required.");

            if (request is not { Name: { Length: > 0 } })
                return BadRequest("Product Name is required.");

            var entity = new ChangeTrackerModel.Models.Entities.PlatformContentTakealotEntity
            {
                Id = request.Id == Guid.Empty ? Guid.NewGuid() : request.Id,
                Name = request.Name,
                LastUpdated = request.LastUpdated,
                Url = request.Url,
                ProductIdentifier = request.ProductIdentifier,
                InStock = request.InStock,
                MetaRaw = "{}"
            };
            await _context.PlatformContentTakealot.AddAsync(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, request);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] TakealotContentResponse request)
        {
            if (request is null)
                return BadRequest("Request body is required.");

            if (request is not { Name: { Length: > 0 } })
                return BadRequest("Product Name is required.");

            var entity = await _context.PlatformContentTakealot.FindAsync(id);
            if (entity == null) return NotFound();
            entity.Name = request.Name;
            entity.LastUpdated = request.LastUpdated;
            entity.Url = request.Url;
            entity.ProductIdentifier = request.ProductIdentifier;
            entity.InStock = request.InStock;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var entity = await _context.PlatformContentTakealot.FindAsync(id);
            if (entity == null) return NotFound();
            _context.PlatformContentTakealot.Remove(entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
