import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CategoriesService, CategoryDto, CategoryTreeDto } from '../../ct-client';
import { TreeNode } from '../../shared/models/tree-node.model';



@Injectable({ providedIn: 'root' })
export class CategoriesState {
  private readonly treeNodesSubject = new BehaviorSubject<TreeNode[]>([]);
  readonly treeNodes$: Observable<TreeNode[]> = this.treeNodesSubject.asObservable();

  private readonly categoriesFlatSubject = new BehaviorSubject<CategoryDto[]>([]);
  readonly categoriesFlat$: Observable<CategoryDto[]> = this.categoriesFlatSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  constructor(private _categoryService:CategoriesService)
  {

  }

  private convertToTreeNodes(categories: CategoryTreeDto[]): TreeNode[] {
    return categories.map((category) => ({
      name: category.name ?? "",
      value: category.id ?? "",
      children: category.children?.length
        ? this.convertToTreeNodes(category.children)
        : [],
      disabled: false,
      expanded: true,
    }));
  }

    fetchCategoriesTree(): void {
    this._categoryService.apiCategoriesTreeGet()
      .pipe(map((categories) => this.convertToTreeNodes(categories)))
      .subscribe((treeNodes) => {
        this.treeNodesSubject.next(treeNodes);
      });
  }

    fetchCategoriesFlat(): void {
    this._categoryService.apiCategoriesGet() 
      .pipe()
      .subscribe((categories) => {
        this.categoriesFlatSubject.next(categories);
      });
  }


  getHierarchy(targetId: string)
  {
      let categories = this.treeNodesSubject.getValue();
      return this.findPath(categories, targetId);
  }

private findPath(categories: TreeNode[], targetId: string): string[] | null {
  for (const category of categories) {
    if (category.value === targetId) {
      return [category.name ?? ""];
    }

    if (category.children && category.children.length > 0) {
      const childPath = this.findPath(category.children, targetId);
      if (childPath) {
        return [category.name ?? "", ...childPath];
      }
    }
  }
  return null;
}



  clear() {
    this.treeNodesSubject.next([]);
    this.categoriesFlatSubject.next([]);
    this.isLoadingSubject.next(false);
  }


}
