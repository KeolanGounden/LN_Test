using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductManagementAPI.Entities
{
    public class ProductEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string SKU { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public Guid? CategoryId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
