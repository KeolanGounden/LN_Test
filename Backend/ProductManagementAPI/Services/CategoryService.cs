using ProductManagementAPI.Interfaces;
using ProductManagementAPI.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace ProductManagementAPI.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repo;

        public CategoryService(ICategoryRepository repo)
        {
            _repo = repo;
        }

        public async Task<CategoryDto> CreateAsync(CreateCategoryRequest req)
        {
            var id = Guid.NewGuid();
            var dto = new CategoryDto(id, req.Name, req.Description, req.ParentCategoryId);
            await _repo.AddAsync(dto);
            return dto;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllAsync()
        {
            var all = await _repo.GetAllAsync();
            return all.OrderBy(c => c.Name);
        }

        public async Task<CategoryDto?> GetAsync(Guid id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<IEnumerable<CategoryTreeDto>> GetTreeAsync()
        {
            var all = await _repo.GetAllAsync();
            var dict = all.ToDictionary(c => c.Id, c => new CategoryTreeDto(c.Id, c.Name, c.Description, c.ParentCategoryId, new List<CategoryTreeDto>()));

            foreach (var node in dict.Values)
            {
                if (node.ParentCategoryId != null && dict.TryGetValue(node.ParentCategoryId.Value, out var parent))
                {
                    parent.Children.Add(node);
                }
            }

            return dict.Values.Where(n => n.ParentCategoryId == null).ToList();
        }
    }
}
