using ProductManagementAPI.Interfaces;
using ProductManagementAPI.Services;
using ProductManagementAPI.Utils;
using ChangeTrackerModel.DatabaseContext;
using ChangeTrackerModel.Models.Config;
using Microsoft.EntityFrameworkCore;


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
// repositories
services.AddScoped<ProductManagementAPI.Interfaces.IProductRepository, ProductManagementAPI.Repositories.ProductRepository>();
services.AddSingleton<ProductManagementAPI.Interfaces.ICategoryRepository, ProductManagementAPI.Repositories.CategoryRepository>();
// services
services.AddScoped<ProductManagementAPI.Interfaces.ICategoryService, ProductManagementAPI.Services.CategoryService>();
// categories
services.AddSingleton<ProductManagementAPI.Interfaces.ICategoryService, ProductManagementAPI.Services.CategoryService>();


services.AddHttpClient();



// Options
services.AddOptions();
services.Configure<PlatformConfig>(configuration.GetSection(nameof(PlatformConfig)));




services.AddCors();

var app = builder.Build();

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
