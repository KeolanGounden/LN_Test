using System;
using ProductManagementAPI.Entities;

namespace ProductManagementAPI.Models
{
    // Response model that maps to ProductEntity fields more directly
    public record ProductResponse(
        Guid Id,
        string Name,
        string? Description,
        string SKU,
        decimal Price,
        int Quantity,
        Guid? CategoryId,
        DateTime CreatedAt,
        DateTime UpdatedAt,
        IReadOnlyList<CategoryDto> CategoryHierarchy)
    {
        public bool InStock => Quantity > 0;

        public static ProductResponse FromEntity(ProductEntity e, IReadOnlyList<CategoryDto>? categoryHierarchy = null)
        {
            if (e == null) throw new ArgumentNullException(nameof(e));
            var hierarchy = categoryHierarchy ?? Array.Empty<CategoryDto>();
            return new ProductResponse(
                e.Id,
                e.Name,
                e.Description,
                e.SKU,
                e.Price,
                e.Quantity,
                e.CategoryId,
                e.CreatedAt,
                e.UpdatedAt,
                hierarchy);
        }
    }
}
