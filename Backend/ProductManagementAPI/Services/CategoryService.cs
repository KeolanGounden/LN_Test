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

        public CategoryDto Create(CreateCategoryRequest req)
        {
            var id = Guid.NewGuid();
            var dto = new CategoryDto(id, req.Name, req.Description, req.ParentCategoryId);
            _repo.AddAsync(dto).GetAwaiter().GetResult();
            return dto;
        }

        public IEnumerable<CategoryDto> GetAll()
        {
            return _repo.GetAllAsync().GetAwaiter().GetResult().OrderBy(c => c.Name);
        }

        public CategoryDto? Get(Guid id)
        {
            return _repo.GetByIdAsync(id).GetAwaiter().GetResult();
        }

        public IEnumerable<CategoryTreeDto> GetTree()
        {
            var all = _repo.GetAllAsync().GetAwaiter().GetResult();
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
