using ChangeTrackerModel.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChangeTrackerModel.DatabaseContext
{
    public class MySqlContext: DbContext
    {
        public MySqlContext(DbContextOptions<MySqlContext> options):base(options)
        {

        }

        public DbSet<PlatformContentTakealotEntity> PlatformContentTakealot { get; set; }
        public DbSet<UserEntity> Users { get; set; }


        public static void BuildModel(ModelBuilder modelBuilder, DatabaseFacade database)
        {
   
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           
        }

    }
}
