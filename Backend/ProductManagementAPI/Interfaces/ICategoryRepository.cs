using ProductManagementAPI.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductManagementAPI.Interfaces
{
    public interface ICategoryRepository : IRepository<CategoryDto>
    {
    }
}
