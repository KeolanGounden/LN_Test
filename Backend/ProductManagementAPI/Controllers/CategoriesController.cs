using Microsoft.AspNetCore.Mvc;
using ProductManagementAPI.Interfaces;
using ProductManagementAPI.Models;
using System;

namespace ProductManagementAPI.Controllers
{
    [Route("api/categories")]
    public class CategoriesController : Controller
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var all = await _categoryService.GetAllAsync();
            return Ok(all);
        }

        [HttpGet("tree")]
        public async Task<IActionResult> GetTree()
        {
            var tree = await _categoryService.GetTreeAsync();
            return Ok(tree);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCategoryRequest req)
        {
            if (req is null)
                return BadRequest("Request body is required.");

            // pattern matching: require non-empty Name
            if (req is not { Name: { Length: > 0 } name })
                return BadRequest("Category Name is required.");

            var created = await _categoryService.CreateAsync(req);
            return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
        }
    }
}
