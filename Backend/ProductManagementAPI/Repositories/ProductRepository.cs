using ProductManagementAPI.Interfaces;
using ChangeTrackerModel.Models.Entities;
using ChangeTrackerModel.DatabaseContext;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagementAPI.Repositories
{
    public class ProductRepository : Repository<PlatformContentTakealotEntity>, IProductRepository
    {
        public ProductRepository(MySqlContext context) : base(context)
        {
        }
    }
}
