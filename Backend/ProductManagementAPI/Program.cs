using ProductManagementAPI.Interfaces;
using Microsoft.EntityFrameworkCore;
using ProductManagementAPI.Services;
using ProductManagementAPI.Utils;
using ChangeTrackerModel.DatabaseContext;
using ProductManagementAPI.Repositories;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var services = builder.Services;
var configuration = builder.Configuration;


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
services.AddEndpointsApiExplorer();
services.AddSwaggerGen(options =>
{
    options.RequestBodyFilter<RequestBodyFilter>();
    options.UseAllOfForInheritance();
});

services.AddDbContext<MySqlContext>(options => options.UseMySql(configuration.GetConnectionString("DefaultConnection"), ServerVersion.AutoDetect(configuration.GetConnectionString("DefaultConnection")), x => x.MigrationsAssembly("ProductManagementAPI").UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)), ServiceLifetime.Scoped);

services.AddControllers();

services.AddScoped<IPlatformContentService, PlatformContentService>();
// register product search engine as open-generic for DI
services.AddTransient(typeof(IProductSearchEngine<>), typeof(ProductSearchEngine<>));

// In-memory EF context for products
services.AddDbContext<ProductManagementAPI.Data.InMemoryDbContext>(options => options.UseInMemoryDatabase("ProductsDb"), ServiceLifetime.Scoped);
services.AddScoped<ProductEntityRepository>();
services.AddScoped<IRepository<ProductManagementAPI.Entities.ProductEntity>>(sp => sp.GetRequiredService<ProductEntityRepository>());
services.AddScoped<ProductService>();
services.AddScoped<DatabaseSeeder>();
// repositories
services.AddScoped<IProductRepository, ProductRepository>();
services.AddSingleton<ICategoryRepository,CategoryRepository>();
// services
services.AddScoped<ICategoryService, CategoryService>();
// categories
services.AddSingleton<ICategoryService, CategoryService>();


services.AddHttpClient();



// Options
services.AddOptions();


services.AddCors();

var app = builder.Build();

// seed in-memory database
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetService<ProductManagementAPI.Services.DatabaseSeeder>();
    seeder?.SeedAsync().GetAwaiter().GetResult();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseRouting();
app.UseCors(config => config.WithOrigins(configuration["cors"].Split(';')).AllowAnyHeader().AllowAnyMethod().AllowCredentials());


app.UseAuthorization();

app.MapControllers();


app.Run();
