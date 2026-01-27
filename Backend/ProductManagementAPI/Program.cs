using ProductManagementAPI.Interfaces;
using Microsoft.EntityFrameworkCore;
using ProductManagementAPI.Services;
using ProductManagementAPI.Utils;
using ProductManagementAPI.Repositories;
using ProductManagementAPI.Entities;
using ProductManagementAPI.Data;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var services = builder.Services;
var configuration = builder.Configuration;


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
services.AddEndpointsApiExplorer();
services.AddSwaggerGen(options =>
{
    options.DocumentFilter<AddQueryModelsDocumentFilter>();
    options.RequestBodyFilter<RequestBodyFilter>();
    options.UseAllOfForInheritance();
});

services.AddControllers();

services.AddTransient(typeof(IProductSearchEngine<>), typeof(ProductSearchEngine<>));

// In-memory EF context for products
services.AddDbContext<InMemoryDbContext>(options => options.UseInMemoryDatabase("ProductsDb"), ServiceLifetime.Scoped);
services.AddScoped<ProductEntityRepository>();
services.AddScoped<IRepository<ProductEntity>>(sp => sp.GetRequiredService<ProductEntityRepository>());
services.AddScoped<ProductService>();
services.AddScoped<DatabaseSeeder>();
// repositories
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
    var seeder = scope.ServiceProvider.GetService<DatabaseSeeder>();
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
