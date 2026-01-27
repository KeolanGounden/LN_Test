using ProductManagementAPI.Interfaces;
using ProductManagementAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagementAPI.Repositories
{

    public class CategoryRepository : ICategoryRepository
    {
        private readonly Dictionary<Guid, CategoryDto> _store = new();

        public IQueryable<CategoryDto> Query() => _store.Values.AsQueryable();

        public Task AddAsync(CategoryDto entity)
        {
            _store[entity.Id] = entity;
            return Task.CompletedTask;
        }

        public Task DeleteAsync(Guid id)
        {
            _store.Remove(id);
            return Task.CompletedTask;
        }

        public Task<IEnumerable<CategoryDto>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<CategoryDto>>(_store.Values.ToList());
        }

        public Task<CategoryDto?> GetByIdAsync(Guid id)
        {
            return Task.FromResult(_store.TryGetValue(id, out var c) ? c : null);
        }

        public Task UpdateAsync(CategoryDto entity)
        {
            _store[entity.Id] = entity;
            return Task.CompletedTask;
        }
    }
}
