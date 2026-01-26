using Microsoft.AspNetCore.Mvc;
using ProductManagementAPI.Extensions;
using ProductManagementAPI.Models;
using ProductManagementAPI.Entities;
using ProductManagementAPI.Interfaces;
using ProductManagementAPI.Services;

namespace ProductManagementAPI.Controllers
{
    [Route("api/products")]
    public class ProductsController : Controller
    {
        private readonly ProductService _productService;
        private readonly IRepository<ProductEntity> _repo;

        public ProductsController(ProductService productService, IRepository<ProductEntity> repo)
        {
            _productService = productService;
            _repo = repo;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<ProductResponse>>> Get([FromQuery] string? name, [FromQuery] Guid? categoryId, [FromQuery] int pageNumber = 0, [FromQuery] int pageSize = 10, [FromQuery] string? sortBy = null, [FromQuery] bool descending = false)
        {
            var req = new TakealotSearchRequest { Name = name, ProductId = null, PageNumber = pageNumber, PageSize = pageSize, SortBy = sortBy, Descending = descending };
            var res = await _productService.SearchProducts(req);
            return Ok(res);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ProductResponse>> GetById(Guid id)
        {
            var resp = await _productService.GetByIdAsync(id);
            if (resp == null) return NotFound();
            return Ok(resp);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TakealotContentResponse request)
        {
            if (request is null)
                return BadRequest("Request body is required.");

            if (request is not { Name: { Length: > 0 } })
                return BadRequest("Product Name is required.");

            var entity = new ProductEntity
            {
                Id = request.Id == Guid.Empty ? Guid.NewGuid() : request.Id,
                Name = request.Name,
                Description = string.Empty,
                SKU = request.ProductIdentifier,
                Price = 0,
                Quantity = request.InStock ? 1 : 0,
                CategoryId = null,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _repo.AddAsync(entity);
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, request);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] TakealotContentResponse request)
        {
            if (request is null)
                return BadRequest("Request body is required.");

            if (request is not { Name: { Length: > 0 } })
                return BadRequest("Product Name is required.");

            var entity = await _repo.GetByIdAsync(id);
            if (entity == null) return NotFound();
            entity.Name = request.Name;
            entity.SKU = request.ProductIdentifier;
            entity.Quantity = request.InStock ? 1 : 0;
            entity.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateAsync(entity);
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity == null) return NotFound();
            await _repo.DeleteAsync(id);
            return NoContent();
        }
    }
}
