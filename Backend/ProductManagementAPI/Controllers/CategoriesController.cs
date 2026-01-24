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
        public IActionResult GetAll()
        {
            return Ok(_categoryService.GetAll());
        }

        [HttpGet("tree")]
        public IActionResult GetTree()
        {
            return Ok(_categoryService.GetTree());
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateCategoryRequest req)
        {
            var created = _categoryService.Create(req);
            return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
        }
    }
}
