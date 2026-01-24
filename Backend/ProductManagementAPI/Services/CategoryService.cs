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
        // in-memory store
        private readonly ConcurrentDictionary<Guid, CategoryDto> _store = new();

        public CategoryService()
        {
            // seed with some categories
            var root = new CategoryDto(Guid.NewGuid(), "Root", null, null);
            _store[root.Id] = root;
        }

        public CategoryDto Create(CreateCategoryRequest req)
        {
            var id = Guid.NewGuid();
            var dto = new CategoryDto(id, req.Name, req.Description, req.ParentCategoryId);
            _store[id] = dto;
            return dto;
        }

        public IEnumerable<CategoryDto> GetAll()
        {
            return _store.Values.OrderBy(c => c.Name);
        }

        public CategoryDto? Get(Guid id)
        {
            return _store.TryGetValue(id, out var c) ? c : null;
        }

        public IEnumerable<CategoryTreeDto> GetTree()
        {
            var dict = _store.Values.ToDictionary(c => c.Id, c => new CategoryTreeDto(c.Id, c.Name, c.Description, c.ParentCategoryId, new List<CategoryTreeDto>()));

            // build parent-child
            foreach (var node in dict.Values)
            {
                if (node.ParentCategoryId != null && dict.TryGetValue(node.ParentCategoryId.Value, out var parent))
                {
                    parent.Children.Add(node);
                }
            }

            // roots
            return dict.Values.Where(n => n.ParentCategoryId == null).ToList();
        }
    }
}
