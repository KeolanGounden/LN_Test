using ChangeTrackerModel.Models.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ChangeTrackerModel.Models.Entities
{
    [Table("platform_content_takealot")]
    [Index(nameof(ProductIdentifier), IsUnique = true)]
    [Index(nameof(Name))]
    [Index(nameof(LastUpdated))]
    public class PlatformContentTakealotEntity : IComparable<PlatformContentTakealotEntity>, IComparable
    {
        [Column("id")]
        public Guid Id { get; set; }
        [Column("name")]
        public string Name { get; set; }

        [Column("last_updated")]
        public DateTime LastUpdated { get; set; }
        [Column("product_identifier")]
        public string ProductIdentifier { get; set; }

        [Column("in_stock")]
        public bool InStock { get; set; }

        [Column("url")]
        public string Url { get; set; }
        [Column("product_meta")]
        public string MetaRaw { get; set; }


        [NotMapped]
        public TakealotProductDetails TakealotProduct
        {
            get
            {
       
                    if (MetaRaw == null || MetaRaw == "")
                    {
                        return new TakealotProductDetails();
                    }
                    else
                    {
                        try
                        {
                            return JsonSerializer.Deserialize<TakealotProductDetails>(MetaRaw);
                        }
                        catch
                        {
                            MetaRaw = "{}";
                            return new TakealotProductDetails();
                        }
                    }
           

            }
            set { MetaRaw = value == null ? JsonSerializer.Serialize(new TakealotProductDetails()) : JsonSerializer.Serialize(value); }
        }

        // Custom comparison: prefer in-stock items, then by Name (case-insensitive), then by ProductIdentifier
        public int CompareTo(PlatformContentTakealotEntity? other)
        {
            if (other is null) return 1;

            // In-stock first
            if (InStock && !other.InStock) return -1;
            if (!InStock && other.InStock) return 1;

            // compare names (null-safe)
            var nameA = Name ?? string.Empty;
            var nameB = other.Name ?? string.Empty;
            var nameCmp = string.Compare(nameA, nameB, StringComparison.OrdinalIgnoreCase);
            if (nameCmp != 0) return nameCmp;

            // fallback to product identifier
            var idA = ProductIdentifier ?? string.Empty;
            var idB = other.ProductIdentifier ?? string.Empty;
            return string.Compare(idA, idB, StringComparison.OrdinalIgnoreCase);
        }

        int IComparable.CompareTo(object? obj)
        {
            if (obj is PlatformContentTakealotEntity other)
                return CompareTo(other);
            throw new ArgumentException("Object is not a PlatformContentTakealotEntity");
        }

    }
}
