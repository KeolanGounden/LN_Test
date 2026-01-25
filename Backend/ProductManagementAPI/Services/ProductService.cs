using ProductManagementAPI.Entities;
using ProductManagementAPI.Interfaces;
using ProductManagementAPI.Models;
using ProductManagementAPI.Repositories;
using ProductManagementAPI.Extensions;
using Microsoft.EntityFrameworkCore;
using ProductManagementAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProductManagementAPI.Services;

namespace ProductManagementAPI.Services
{
    public class ProductService
    {
        private readonly IRepository<ProductEntity> _repo;
        private readonly IProductSearchEngine<ProductEntity> _searchEngine;
        private readonly ICategoryRepository _catRepo;

        public ProductService(IRepository<ProductEntity> repo, IProductSearchEngine<ProductEntity> searchEngine, ICategoryRepository catRepo)
        {
            _repo = repo;
            _searchEngine = searchEngine;
            _catRepo = catRepo;
            // configure fields
            var fields = new (Func<ProductEntity, string> selector, double weight, string name)[]
            {
                (p => p.Name ?? string.Empty, 1.0, "name"),
                (p => p.SKU ?? string.Empty, 0.6, "sku"),
                (p => p.Description ?? string.Empty, 0.4, "desc")
            };
            _searchEngine.ConfigureFields(fields);
        }

        private IReadOnlyList<CategoryDto> BuildCategoryHierarchy(Guid? categoryId, List<CategoryDto> allCats)
        {
            var dict = allCats.ToDictionary(c => c.Id, c => c);
            var list = new List<CategoryDto>();
            var cur = categoryId;
            while (cur != null && dict.TryGetValue(cur.Value, out var cat))
            {
                list.Add(cat);
                cur = cat.ParentCategoryId;
            }
            list.Reverse();
            return list;
        }

        public async Task<ProductManagementAPI.Extensions.PagedResult<ProductResponse>> SearchProducts(TakealotSearchRequest req)
        {
            // Build base query with filters other than name
            var query = _repo.Query();

            var allCategories = (await _catRepo.GetAllAsync()).ToList();

            if (req.LastUpdatedStart != null && req.LastUpdatedEnd != null)
            {
                query = query.Where(x => x.UpdatedAt.Date >= req.LastUpdatedStart.Value.Date && x.UpdatedAt.Date <= req.LastUpdatedEnd.Value.Date);
            }

            if (!string.IsNullOrWhiteSpace(req.ProductId))
            {
                query = query.Where(x => x.SKU.Contains(req.ProductId));
            }

            if (req.InStock != null)
            {
                if (req.InStock.Value)
                    query = query.Where(x => x.Quantity > 0);
                else
                    query = query.Where(x => x.Quantity == 0);
            }

            // If no name provided, fall back to database paging
            if (string.IsNullOrWhiteSpace(req.Name))
            {
                // apply sorting to query according to request.SortBy / request.Descending
                query = req.SortBy?.ToLowerInvariant() switch
                {
                    "name" => req.Descending ? query.OrderByDescending(x => x.Name) : query.OrderBy(x => x.Name),
                    "lastupdated" => req.Descending ? query.OrderByDescending(x => x.UpdatedAt) : query.OrderBy(x => x.UpdatedAt),
                    "sku" => req.Descending ? query.OrderByDescending(x => x.SKU) : query.OrderBy(x => x.SKU),
                    "price" => req.Descending ? query.OrderByDescending(x => x.Price) : query.OrderBy(x => x.Price),
                    "quantity" => req.Descending ? query.OrderByDescending(x => x.Quantity) : query.OrderBy(x => x.Quantity),
                    _ => req.Descending ? query.OrderByDescending(x => x.Name) : query.OrderBy(x => x.Name),
                };


                var totalCount = await query.CountAsync();
                var items = await query.Skip(req.PageNumber * req.PageSize).Take(req.PageSize).ToListAsync();

                var mapped = items.Select(e => ProductResponse.FromEntity(e, BuildCategoryHierarchy(e.CategoryId, allCategories))).ToList();

                return new ProductManagementAPI.Extensions.PagedResult<ProductResponse>
                {
                    Items = mapped,
                    TotalCount = totalCount,
                    PageNumber = req.PageNumber,
                    PageSize = req.PageSize
                };
            }

            var candidates = await query.OrderBy(x => x.Name).ToListAsync();

            var results = _searchEngine.Search(candidates, req.Name ?? string.Empty, maxResults: candidates.Count()).ToList();

            // sort in-memory results: primary by score desc, then by requested sort field
            results.Sort((a, b) =>
            {
                var scoreCmp = b.Score.CompareTo(a.Score);
                if (scoreCmp != 0) return scoreCmp;

                var sortBy = req.SortBy?.ToLowerInvariant();
                var desc = req.Descending;
                int fieldCmp = 0;
                switch (sortBy)
                {
                    case "name":
                        fieldCmp = string.Compare(a.Item?.Name, b.Item?.Name, StringComparison.OrdinalIgnoreCase);
                        break;
                    case "lastupdated":
                        DateTime? aDate = a.Item?.UpdatedAt;
                        DateTime? bDate = b.Item?.UpdatedAt;
                        if (aDate == bDate) fieldCmp = 0;
                        else if (aDate == null) fieldCmp = -1;
                        else if (bDate == null) fieldCmp = 1;
                        else fieldCmp = aDate.Value.CompareTo(bDate.Value);
                        break;
                    case "sku":
                        fieldCmp = string.Compare(a.Item?.SKU, b.Item?.SKU, StringComparison.OrdinalIgnoreCase);
                        break;
                    case "price":
                        fieldCmp = a.Item.Price.CompareTo(b.Item.Price);
                        break;
                    case "quantity":
                        fieldCmp = a.Item.Quantity.CompareTo(b.Item.Quantity);
                        break;
                    default:
                        if (a.Item is IComparable<ProductEntity> && b.Item is ProductEntity)
                        {
                            fieldCmp = ((IComparable<ProductEntity>)a.Item).CompareTo(b.Item);
                        }
                        else if (a.Item is IComparable && b.Item is IComparable)
                        {
                            fieldCmp = ((IComparable)a.Item).CompareTo(b.Item);
                        }
                        else
                        {
                            fieldCmp = string.Compare(a.Item?.ToString(), b.Item?.ToString(), StringComparison.OrdinalIgnoreCase);
                        }
                        break;
                }

                return desc ? -fieldCmp : fieldCmp;
            });

            var total = results.Count;

            var paged = results
                .Skip(req.PageNumber * req.PageSize)
                .Take(req.PageSize)
                .Select(r => ProductResponse.FromEntity(r.Item, BuildCategoryHierarchy(r.Item.CategoryId, allCategories)))
                .ToList();

            return new ProductManagementAPI.Extensions.PagedResult<ProductResponse>
            {
                Items = paged,
                TotalCount = total,
                PageNumber = req.PageNumber,
                PageSize = req.PageSize
            };
        }

        public async Task<ProductResponse?> GetByIdAsync(Guid id)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return null;
            var allCats = (await _catRepo.GetAllAsync()).ToList();
            return ProductResponse.FromEntity(e, BuildCategoryHierarchy(e.CategoryId, allCats));
        }
    }
}
