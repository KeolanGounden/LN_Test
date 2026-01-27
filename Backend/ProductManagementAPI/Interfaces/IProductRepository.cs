using ProductManagementAPI.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductManagementAPI.Interfaces
{
    public interface IProductRepository : IRepository<ProductEntity>
    {
    }
}
