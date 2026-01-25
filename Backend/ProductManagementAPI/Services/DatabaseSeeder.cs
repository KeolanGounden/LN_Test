using ProductManagementAPI.Interfaces;
using ProductManagementAPI.Models;
using ProductManagementAPI.Entities;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace ProductManagementAPI.Services
{
    public class DatabaseSeeder
    {
        private readonly ICategoryRepository _catRepo;
        private readonly IRepository<ProductEntity> _prodRepo;

        public DatabaseSeeder(ICategoryRepository catRepo, IRepository<ProductEntity> prodRepo)
        {
            _catRepo = catRepo;
            _prodRepo = prodRepo;
        }

        public async Task SeedAsync()
        {
            // Seed categories into category repository
            var electronicsId = Guid.NewGuid();
            var electronics = new CategoryDto(electronicsId, "Electronics", "Electronic devices and accessories", null);
            await _catRepo.AddAsync(electronics);

            var computersId = Guid.NewGuid();
            var computers = new CategoryDto(computersId, "Computers", "Desktops and laptops", electronicsId);
            await _catRepo.AddAsync(computers);

            var laptopsId = Guid.NewGuid();
            var laptops = new CategoryDto(laptopsId, "Laptops", "Portable computers", computersId);
            await _catRepo.AddAsync(laptops);

            var desktopsId = Guid.NewGuid();
            var desktops = new CategoryDto(desktopsId, "Desktops", "Desktop computers", computersId);
            await _catRepo.AddAsync(desktops);

            var accessoriesId = Guid.NewGuid();
            var accessories = new CategoryDto(accessoriesId, "Accessories", "Computer accessories", electronicsId);
            await _catRepo.AddAsync(accessories);

            var homeId = Guid.NewGuid();
            var home = new CategoryDto(homeId, "Home & Office", "Home and office supplies", null);
            await _catRepo.AddAsync(home);

            var stationeryId = Guid.NewGuid();
            var stationery = new CategoryDto(stationeryId, "Stationery", "Paper and stationery items", homeId);
            await _catRepo.AddAsync(stationery);

            var bindersId = Guid.NewGuid();
            var binders = new CategoryDto(bindersId, "Binders", "Ring binders and folders", stationeryId);
            await _catRepo.AddAsync(binders);

            var officeSuppliesId = Guid.NewGuid();
            var officeSupplies = new CategoryDto(officeSuppliesId, "Office Supplies", "General office supplies", homeId);
            await _catRepo.AddAsync(officeSupplies);

            var sportsId = Guid.NewGuid();
            var sports = new CategoryDto(sportsId, "Sports & Outdoors", "Sporting goods and outdoor", null);
            await _catRepo.AddAsync(sports);

            var fitnessId = Guid.NewGuid();
            var fitness = new CategoryDto(fitnessId, "Fitness", "Fitness equipment", sportsId);
            await _catRepo.AddAsync(fitness);

            // add a curated list of real products linked to categories
            var categories = await _catRepo.GetAllAsync();
            var catList = categories.ToList();
            var firstCat = catList.FirstOrDefault();

            var curated = new List<ProductEntity>
            {
                new ProductEntity { Id = Guid.NewGuid(), Name = "Apple MacBook Pro 16", Description = "Apple M1 Pro laptop", SKU = "MBP16-2021", Price = 2499.00m, Quantity = 5, CategoryId = catList.FirstOrDefault(c => c.Name == "Laptops")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new ProductEntity { Id = Guid.NewGuid(), Name = "Dell XPS 13", Description = "Dell XPS 13 laptop", SKU = "XPS13-9310", Price = 1199.00m, Quantity = 8, CategoryId = catList.FirstOrDefault(c => c.Name == "Laptops")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new ProductEntity { Id = Guid.NewGuid(), Name = "Lenovo ThinkPad X1 Carbon", Description = "Business ultrabook", SKU = "TPX1-Gen9", Price = 1399.00m, Quantity = 7, CategoryId = catList.FirstOrDefault(c => c.Name == "Laptops")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new ProductEntity { Id = Guid.NewGuid(), Name = "HP Spectre x360", Description = "Convertible laptop", SKU = "HP-SPX360", Price = 1299.00m, Quantity = 6, CategoryId = catList.FirstOrDefault(c => c.Name == "Laptops")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new ProductEntity { Id = Guid.NewGuid(), Name = "ASUS ROG Strix G15", Description = "Gaming laptop", SKU = "ASUS-ROG-G15", Price = 1599.00m, Quantity = 4, CategoryId = catList.FirstOrDefault(c => c.Name == "Laptops")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },

                new ProductEntity { Id = Guid.NewGuid(), Name = "Logitech MX Master 3 Mouse", Description = "Wireless ergonomic mouse", SKU = "LOG-MX3", Price = 99.99m, Quantity = 25, CategoryId = catList.FirstOrDefault(c => c.Name == "Accessories")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new ProductEntity { Id = Guid.NewGuid(), Name = "Bose QuietComfort 45", Description = "Noise cancelling headphones", SKU = "BQC45", Price = 329.00m, Quantity = 12, CategoryId = catList.FirstOrDefault(c => c.Name == "Accessories")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new ProductEntity { Id = Guid.NewGuid(), Name = "Sony WH-1000XM4", Description = "Wireless noise cancelling headphones", SKU = "SONY-XM4", Price = 299.99m, Quantity = 10, CategoryId = catList.FirstOrDefault(c => c.Name == "Accessories")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new ProductEntity { Id = Guid.NewGuid(), Name = "Anker PowerCore 10000", Description = "Portable power bank", SKU = "ANK-PWR-10000", Price = 29.99m, Quantity = 60, CategoryId = catList.FirstOrDefault(c => c.Name == "Accessories")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new ProductEntity { Id = Guid.NewGuid(), Name = "Samsung T7 Portable SSD 1TB", Description = "External SSD", SKU = "SM-T7-1TB", Price = 139.99m, Quantity = 20, CategoryId = catList.FirstOrDefault(c => c.Name == "Accessories")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },

                new ProductEntity { Id = Guid.NewGuid(), Name = "Bantex B1355 A4 2 O-Ring 25mm PVC Ring Binder - Blue", Description = "Blue ring binder", SKU = "BB-25-BL", Price = 12.50m, Quantity = 50, CategoryId = catList.FirstOrDefault(c => c.Name == "Binders")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new ProductEntity { Id = Guid.NewGuid(), Name = "Staples A4 Ring Binder 25mm", Description = "Office binder A4", SKU = "STP-25-A4", Price = 9.99m, Quantity = 75, CategoryId = catList.FirstOrDefault(c => c.Name == "Binders")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new ProductEntity { Id = Guid.NewGuid(), Name = "Leitz Durable Ring Binder A4", Description = "Durable binder", SKU = "LEI-A4-25", Price = 14.99m, Quantity = 30, CategoryId = catList.FirstOrDefault(c => c.Name == "Binders")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },

                new ProductEntity { Id = Guid.NewGuid(), Name = "Manduka PRO Yoga Mat", Description = "High-density yoga mat", SKU = "MDK-PRO", Price = 120.00m, Quantity = 15, CategoryId = catList.FirstOrDefault(c => c.Name == "Fitness")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new ProductEntity { Id = Guid.NewGuid(), Name = "Adidas Yoga Mat", Description = "Lightweight exercise mat", SKU = "AD-YM-01", Price = 29.99m, Quantity = 40, CategoryId = catList.FirstOrDefault(c => c.Name == "Fitness")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new ProductEntity { Id = Guid.NewGuid(), Name = "Nike Running Shoes", Description = "Men's running shoes", SKU = "NK-RS-01", Price = 89.99m, Quantity = 22, CategoryId = catList.FirstOrDefault(c => c.Name == "Fitness")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },

                new ProductEntity { Id = Guid.NewGuid(), Name = "Apple iPhone 13", Description = "Smartphone", SKU = "IP13-128", Price = 799.00m, Quantity = 20, CategoryId = catList.FirstOrDefault(c => c.Name == "Electronics")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new ProductEntity { Id = Guid.NewGuid(), Name = "Samsung Galaxy S21", Description = "Smartphone", SKU = "SGS21", Price = 699.00m, Quantity = 18, CategoryId = catList.FirstOrDefault(c => c.Name == "Electronics")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new ProductEntity { Id = Guid.NewGuid(), Name = "Amazon Echo Dot (4th Gen)", Description = "Smart speaker", SKU = "AM-ECHO-DOT", Price = 49.99m, Quantity = 35, CategoryId = catList.FirstOrDefault(c => c.Name == "Electronics")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new ProductEntity { Id = Guid.NewGuid(), Name = "Google Nest Mini", Description = "Smart speaker", SKU = "GN-NEST-MINI", Price = 39.99m, Quantity = 28, CategoryId = catList.FirstOrDefault(c => c.Name == "Electronics")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },

                new ProductEntity { Id = Guid.NewGuid(), Name = "Canon EOS 250D DSLR", Description = "Entry level DSLR camera", SKU = "CAN-250D", Price = 549.00m, Quantity = 6, CategoryId = catList.FirstOrDefault(c => c.Name == "Accessories")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new ProductEntity { Id = Guid.NewGuid(), Name = "Microsoft Surface Pro 7", Description = "2-in-1 detachable laptop", SKU = "MS-SP7", Price = 899.00m, Quantity = 9, CategoryId = catList.FirstOrDefault(c => c.Name == "Laptops")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new ProductEntity { Id = Guid.NewGuid(), Name = "HP OfficeJet Printer", Description = "All-in-one inkjet printer", SKU = "HP-OJ-3830", Price = 129.00m, Quantity = 14, CategoryId = catList.FirstOrDefault(c => c.Name == "Office Supplies")?.Id ?? firstCat?.Id, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            };

            foreach (var prod in curated)
            {
                await _prodRepo.AddAsync(prod);
            }

            // add 100 additional products distributed across categories
            var rnd = new Random(1234);
            for (int i = 1; i <= 100; i++)
            {
                var cat = catList[rnd.Next(catList.Count)];
                var prod = new ProductEntity
                {
                    Id = Guid.NewGuid(),
                    Name = $"Sample Product {i}",
                    Description = $"Description for product {i}",
                    SKU = $"SKU-{i:0000}",
                    Price = Math.Round((decimal)(rnd.NextDouble() * 500), 2),
                    Quantity = rnd.Next(0, 100),
                    CategoryId = cat.Id,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await _prodRepo.AddAsync(prod);
            }
        }
    }
}
