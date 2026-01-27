import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { CategoriesService, CategoryDto, CategoryTreeDto } from '../../ct-client';
import { TreeNode } from '../../shared/models/tree-node.model';
import { MatSnackBar } from '@angular/material/snack-bar';



@Injectable({ providedIn: 'root' })
export class CategoriesState {
  private readonly treeNodesSubject = new BehaviorSubject<TreeNode[]>([]);
  readonly treeNodes$: Observable<TreeNode[]> = this.treeNodesSubject.asObservable();

  private readonly categoriesFlatSubject = new BehaviorSubject<CategoryDto[]>([]);
  readonly categoriesFlat$: Observable<CategoryDto[]> = this.categoriesFlatSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);

    private isCreatingSubject =  new BehaviorSubject<boolean>(false);
  private createTrigger$ = new Subject<CategoryDto>();

  constructor(private _categoryService:CategoriesService,private _snackBar: MatSnackBar)
  {


        this.createTrigger$.pipe(
          switchMap((req:CategoryDto) => {
            this.isCreatingSubject.next(true);
            return this._categoryService.apiCategoriesPost(req).pipe(
              tap(() => {
                this._snackBar.open('Category added', 'Close', { duration: 3000 });
                this.isCreatingSubject.next(true);
               
                this.fetchCategoriesTree();
              }),
              catchError(error => {
                this._snackBar.open(`Failed to create category: ${error.message}`, 'Close', { duration: 5000 });
                this.isCreatingSubject.next(false);
                return of(undefined);
              }),
              finalize(() => this.isCreatingSubject.next(false))
            );
          })
        ).subscribe();


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

  addCategory(category: CategoryDto): void {
     this.createTrigger$.next(category);
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
