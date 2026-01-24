using ProductManagementAPI.Interfaces;
using ProductManagementAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagementAPI.Repositories
{
    // in-memory category repository implementation using base Repository isn't applicable because base uses MySqlContext.
    // Provide a specialized in-memory repo that still implements IRepository<CategoryDto>.
    public class CategoryRepository : ICategoryRepository
    {
        private readonly Dictionary<Guid, CategoryDto> _store = new();

        public CategoryRepository()
        {
            Seed();
        }

        private void Seed()
        {
            // Build a small hierarchical category tree
            // Electronics
            var electronicsId = Guid.NewGuid();
            var electronics = new CategoryDto(electronicsId, "Electronics", "Electronic devices and accessories", null);
            _store[electronicsId] = electronics;

            var computersId = Guid.NewGuid();
            var computers = new CategoryDto(computersId, "Computers", "Desktops and laptops", electronicsId);
            _store[computersId] = computers;

            var laptopsId = Guid.NewGuid();
            var laptops = new CategoryDto(laptopsId, "Laptops", "Portable computers", computersId);
            _store[laptopsId] = laptops;

            var desktopsId = Guid.NewGuid();
            var desktops = new CategoryDto(desktopsId, "Desktops", "Desktop computers", computersId);
            _store[desktopsId] = desktops;

            var accessoriesId = Guid.NewGuid();
            var accessories = new CategoryDto(accessoriesId, "Accessories", "Computer accessories", electronicsId);
            _store[accessoriesId] = accessories;

            // Home & Office
            var homeId = Guid.NewGuid();
            var home = new CategoryDto(homeId, "Home & Office", "Home and office supplies", null);
            _store[homeId] = home;

            var stationeryId = Guid.NewGuid();
            var stationery = new CategoryDto(stationeryId, "Stationery", "Paper and stationery items", homeId);
            _store[stationeryId] = stationery;

            var bindersId = Guid.NewGuid();
            var binders = new CategoryDto(bindersId, "Binders", "Ring binders and folders", stationeryId);
            _store[bindersId] = binders;

            var officeSuppliesId = Guid.NewGuid();
            var officeSupplies = new CategoryDto(officeSuppliesId, "Office Supplies", "General office supplies", homeId);
            _store[officeSuppliesId] = officeSupplies;

            // Sports
            var sportsId = Guid.NewGuid();
            var sports = new CategoryDto(sportsId, "Sports & Outdoors", "Sporting goods and outdoor", null);
            _store[sportsId] = sports;

            var fitnessId = Guid.NewGuid();
            var fitness = new CategoryDto(fitnessId, "Fitness", "Fitness equipment", sportsId);
            _store[fitnessId] = fitness;
        }

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
