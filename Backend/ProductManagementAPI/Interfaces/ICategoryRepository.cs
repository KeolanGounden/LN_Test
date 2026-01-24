using ProductManagementAPI.Models;
using ChangeTrackerModel.Models.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductManagementAPI.Interfaces
{
    public interface ICategoryRepository : IRepository<CategoryDto>
    {
        // additional category-specific methods could go here
    }
}
