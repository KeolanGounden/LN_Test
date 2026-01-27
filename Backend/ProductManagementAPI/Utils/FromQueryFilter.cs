using Microsoft.OpenApi.Models;
using ProductManagementAPI.Extensions;
using ProductManagementAPI.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace ProductManagementAPI.Utils
{
    public class AddQueryModelsDocumentFilter : IDocumentFilter
    {
        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            // Force ProductSearchRequest schema
            var productSearchSchema = context.SchemaGenerator.GenerateSchema(
                typeof(ProductSearchRequest),
                context.SchemaRepository);

            if (!swaggerDoc.Components.Schemas.ContainsKey(nameof(ProductSearchRequest)))
            {
                swaggerDoc.Components.Schemas.Add(nameof(ProductSearchRequest), productSearchSchema);
            }

            // Force PaginationParams schema
            var paginationSchema = context.SchemaGenerator.GenerateSchema(
                typeof(PaginationParams),
                context.SchemaRepository);

            if (!swaggerDoc.Components.Schemas.ContainsKey(nameof(PaginationParams)))
            {
                swaggerDoc.Components.Schemas.Add(nameof(PaginationParams), paginationSchema);
            }
        }
    }


}