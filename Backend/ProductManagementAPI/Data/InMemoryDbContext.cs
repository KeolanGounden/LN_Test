using Microsoft.EntityFrameworkCore;
using ProductManagementAPI.Entities;

namespace ProductManagementAPI.Data
{
    public class InMemoryDbContext : DbContext
    {
        public InMemoryDbContext(DbContextOptions<InMemoryDbContext> options) : base(options) { }

        public DbSet<ProductEntity> Products { get; set; }
    }
}
