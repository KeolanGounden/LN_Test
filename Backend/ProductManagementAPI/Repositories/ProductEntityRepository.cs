using ProductManagementAPI.Interfaces;
using ProductManagementAPI.Entities;
using ProductManagementAPI.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagementAPI.Repositories
{
    public class ProductEntityRepository : IRepository<ProductEntity>
    {
        private readonly InMemoryDbContext _context;

        public ProductEntityRepository(InMemoryDbContext context)
        {
            _context = context;
        }

        public IQueryable<ProductEntity> Query() => _context.Products.AsNoTracking();

        public async Task AddAsync(ProductEntity entity)
        {
            await _context.Products.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var e = await _context.Products.FindAsync(id);
            if (e == null) return;
            _context.Products.Remove(e);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ProductEntity>> GetAllAsync()
        {
            return await _context.Products.AsNoTracking().ToListAsync();
        }

        public async Task<ProductEntity?> GetByIdAsync(Guid id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task UpdateAsync(ProductEntity entity)
        {
            _context.Products.Update(entity);
            await _context.SaveChangesAsync();
        }
    }
}
