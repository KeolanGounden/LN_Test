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
        public async Task<ActionResult<PagedResult<ProductResponse>>> Get([FromQuery] ProductSearchRequest req)
        {
           
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
        public async Task<IActionResult> Create([FromBody] ProductResponse request)
        {
            if (request is null)
                return BadRequest("Request body is required.");

            if (request is not { Name: { Length: > 0 } })
                return BadRequest("Product Name is required.");

            var entity = new ProductEntity
            {
                Id = request.Id == Guid.Empty ? Guid.NewGuid() : request.Id,
                Name = request.Name,
                Description = request.Description,
                SKU = request.SKU,
                Price = request.Price,
                Quantity = request.Quantity,
                CategoryId = request.CategoryId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _repo.AddAsync(entity);
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, request);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ProductResponse request)
        {
            if (request is null)
                return BadRequest("Request body is required.");

            if (request is not { Name: { Length: > 0 } })
                return BadRequest("Product Name is required.");

            var entity = await _repo.GetByIdAsync(id);
            if (entity == null) return NotFound();
            entity.Name = request.Name;
            entity.Description = request.Description;
            entity.Price = request.Price;
            entity.SKU = request.SKU;
            entity.Quantity = request.Quantity;
            entity.CategoryId = request.CategoryId;
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
