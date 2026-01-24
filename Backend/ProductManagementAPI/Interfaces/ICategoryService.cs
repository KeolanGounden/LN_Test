using System;
using System.Collections.Generic;
using ProductManagementAPI.Models;

namespace ProductManagementAPI.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAllAsync();
        Task<IEnumerable<CategoryTreeDto>> GetTreeAsync();
        Task<CategoryDto?> GetAsync(Guid id);
        Task<CategoryDto> CreateAsync(CreateCategoryRequest req);
    }
}
