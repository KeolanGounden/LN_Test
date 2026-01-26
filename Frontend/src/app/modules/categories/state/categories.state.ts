import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CategoriesService, CategoryDto, CategoryTreeDto } from '../../ct-client';

export type TreeNode = {
  name: string;
  value: string;
  children?: TreeNode[];
  disabled?: boolean;
  expanded?: boolean;
};

const initialNodes: TreeNode[] = [
  {
    name: 'public',
    value: 'public',
    children: [
      { name: 'index.html', value: 'public/index.html' },
      { name: 'favicon.ico', value: 'public/favicon.ico' },
      { name: 'styles.css', value: 'public/styles.css' },
    ],
    expanded: true,
  },
  {
    name: 'src',
    value: 'src',
    children: [
      {
        name: 'app',
        value: 'src/app',
        children: [
          { name: 'app.ts', value: 'src/app/app.ts' },
          { name: 'app.html', value: 'src/app/app.html' },
          { name: 'app.css', value: 'src/app/app.css' },
        ],
        expanded: false,
      },
      {
        name: 'assets',
        value: 'src/assets',
        children: [{ name: 'logo.png', value: 'src/assets/logo.png' }],
        expanded: false,
      },
      {
        name: 'environments',
        value: 'src/environments',
        children: [
          { name: 'environment.prod.ts', value: 'src/environments/environment.prod.ts', expanded: false },
          { name: 'environment.ts', value: 'src/environments/environment.ts' },
        ],
        expanded: false,
      },
      { name: 'main.ts', value: 'src/main.ts' },
      { name: 'polyfills.ts', value: 'src/polyfills.ts' },
      { name: 'styles.css', value: 'src/styles.css', disabled: true },
      { name: 'test.ts', value: 'src/test.ts' },
    ],
    expanded: false,
  },
  { name: 'angular.json', value: 'angular.json' },
  { name: 'package.json', value: 'package.json' },
  { name: 'README.md', value: 'README.md' },
];

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


  clear() {
    this.treeNodesSubject.next([]);
    this.categoriesFlatSubject.next([]);
    this.isLoadingSubject.next(false);
  }


}
