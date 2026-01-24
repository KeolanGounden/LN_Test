using System;
using System.Collections.Generic;

namespace ProductManagementAPI.Models
{
    public record CategoryDto(Guid Id, string Name, string? Description, Guid? ParentCategoryId);

    public record CategoryTreeDto(Guid Id, string Name, string? Description, Guid? ParentCategoryId, List<CategoryTreeDto> Children);

    public record CreateCategoryRequest(string Name, string? Description, Guid? ParentCategoryId);
}
