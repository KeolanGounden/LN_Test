using System;
using System.Collections.Generic;
using ProductManagementAPI.Models;

namespace ProductManagementAPI.Interfaces
{
    public interface ICategoryService
    {
        IEnumerable<CategoryDto> GetAll();
        IEnumerable<CategoryTreeDto> GetTree();
        CategoryDto? Get(Guid id);
        CategoryDto Create(CreateCategoryRequest req);
    }
}
