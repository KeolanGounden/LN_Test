import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MtxGrid, MtxGridCellTemplate, MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { Observable } from 'rxjs';
import { CategoryDto, ProductResponse, ProductSearchRequest} from '../../../ct-client';
import { AsyncPipe } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { HeaderGroupComponent } from '../../../shared/components/header-group/header-group.component';
import { HeaderConfig } from '../../../shared/models/header-config.model';
import { AdvancedSearchConfig, SearchQueryValue } from '../../../shared/models/advanced-search-config.model';
import { ButtonConfig, ButtonType } from '../../../shared/models/button-config.model';
import { MtxDrawer, MtxDrawerModule } from '@ng-matero/extensions/drawer';
import { TableReorderDrawerComponent } from '../../../shared/components/table-reorder-drawer/table-reorder-drawer.component';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import {MatButtonModule} from '@angular/material/button';
import { ProductEditDialogComponent } from '../product-edit-dialog/product-edit-dialog.component';
import { ProductState } from '../../states/product.state';
import { ConfirmationDialogContent } from '../../../shared/models/confirmation-dialog';
import { DialogButtonText } from '../../../shared/models/dialog-button-text.enum';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CategoriesState } from '../../../categories/state/categories.state';
import { TreeNode } from '../../../shared/models/tree-node.model';

@Component({
  selector: 'app-dashboard-wrapper',
  imports: [MtxGridModule, AsyncPipe, MatCardModule, HeaderGroupComponent, MtxDrawerModule, MatMenuModule, MatIconModule,MatButtonModule],
  templateUrl: './product-dashboard-wrapper.component.html',
  styleUrl: './product-dashboard-wrapper.component.scss'
})
export class ProductDashboardWrapperComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('headerRef') headerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('table') table!: MtxGrid;

  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  observer: ResizeObserver | undefined;
  gridHeight = "100vh"



  queryParams: ProductSearchRequest = { pageSize: 25, pageNumber: 0 }

  headerIcon: boolean = true

  headerConfig: HeaderConfig[] = [
    {
      id: "content", title: "Products",

    }
    
  ]

  pageButtons: ButtonConfig[] = [
    {
      icon: "sort",
      type: ButtonType.Icon,
      action: () => {

        const drawerRef = this.drawer.open(TableReorderDrawerComponent, {
          width: '320px',
          position: 'right',
          data: this.table,
          hasBackdrop: true
        })

        drawerRef.afterDismissed().subscribe(result => {
          this.list = [...this.list];
          this.cdr.detectChanges();
        });
      },
      label: "Table Settings",
      tooltip: "Table Settings"
    },

    {
      icon: "refresh",
      type: ButtonType.Icon,
      action: () => { this.getFilteredData(this.searchQuery, this.queryParams.pageNumber) },
      label: "Refresh",
      tooltip: "Refresh"
    }
  ]

  actionButtons: ButtonConfig[] = [

    {
      icon: "add",
      action: () =>  this.openViewDialog() ,
      type: ButtonType.Flat,
      tooltip: "Add Product",
      label: "Add Product"
    }
  ]



  searchQuery: SearchQueryValue | null = {
    genericSearchTerm: '',
    advancedSearchQuery: []
  }

  constructor(private dashboardService: ProductState, private cdr: ChangeDetectorRef, private drawer: MtxDrawer, private dialog: MatDialog, private categoriesState: CategoriesState) {
   categoriesState.fetchCategoriesTree();
   
    this.dashboardService.search({
      name: "",
      pageNumber: 0,
      pageSize: 25
    })

  }



  loading$: Observable<boolean> = this.dashboardService.isLoading$
  productContentCount$: Observable<number> = this.dashboardService.productTotalCount$
  productContent$: Observable<ProductResponse[] | undefined | null> = this.dashboardService.productItems$

  readonly nodes$ = this.categoriesState.treeNodes$;

  id: ProductKeys = 'id';
  name: ProductKeys = 'name';
  description:ProductKeys = 'description';
  sku:ProductKeys = 'sku';
  categoryId:ProductKeys = 'categoryHierarchy';
  price:ProductKeys = 'price';
  quantity:ProductKeys = 'quantity';
  lastUpdated:ProductKeys = 'updatedAt';
  status: ProductKeys = 'inStock';
  actions:string = 'actions'

  columns: MtxGridColumn[] = [
    { header: 'Identifier', field: this.id, disabled: true },
    { header: 'Name', field: this.name },
    { header: 'Description', field: this.description },
    {
      header: 'Last Updated', field: this.lastUpdated, formatter(rowData, colDef) {
        return new Date(rowData.updatedAt).toLocaleDateString()
      },
    },
    { header: 'SKU', field: this.sku },
     { header: 'Category', field: this.categoryId, formatter(rowData, colDef) {
        return rowData.categoryHierarchy?.map((x:CategoryDto)=>x.name).join(" > ") ?? '';
      }, },
    { header: 'Stock Status', field: this.status, },
     { header: 'Quantity', field: this.quantity, },
      { header: 'Price', field: this.price, },
    {
      header: 'Actions', field: this.actions, type: 'button', disabled: true
    }
  ];

  gridTemplate: MtxGridCellTemplate = { [this.status]: this.statusTemplate, [this.actions]: this.actionTemplate };

  list: ProductResponse[] = [];
  categories:TreeNode[] =[]

  searchConfig: AdvancedSearchConfig = {
    generic: { label: 'Search by name', value: '', placeholder: 'Search by name' },
    fields: [
      {
        key: this.lastUpdated,
        label: "Last Updated",
        type: "dateRange",
        placeholder: "Last Updated",
        filterDisplay: (config, value) => {
          if (value && value?.startDate && value?.endDate) {
            const start = value?.startDate ? value.startDate.toLocaleDateString() : 'Any';
            const end = value?.endDate ? value.endDate.toLocaleDateString() : 'Any';
            var result = `From ${start} to ${end}`
            return [result];
          }
          else {
            return []
          }
        }
      },
      {
        key: this.sku,
        label: "SKU",
        type: "text",
        placeholder: "SKU",
        filterDisplay: (config, value: string) => {
          if (value) {
            var result = `SKU contains: ${value}`
            return [result];
          }
          else {
            return []
          }
        },
      },
      {
        key: this.status,
        label: "Product Status",
        type: "select",
        selectOptions: { options: [{ label: 'In Stock', value: true }, { label: 'Out of Stock', value: false }], multiple: false, displayInclusive: false },
        placeholder: "Product Status",
        filterDisplay: (config, value: boolean) => {
          if (value !== null) {

            let item = config.fields.find(x => x.key === this.status)?.selectOptions
            let result = `Product status: ${value}`

            if (item?.options != null) {
              result = `Product status: ${item?.options.find(x => x.value === value)?.label ?? value}`

            }
            return [result];
          }
          else {
            return []
          }
        },
      },
            {
        key: this.categoryId,
        label: "Category",
        type: "tree",
       treeOptions: this.nodes$,
        placeholder: "Category",
        filterDisplay: (config, value: string) => {
          if (value !== null && value !== undefined) {

            let heirarchy = this.categoriesState.getHierarchy(value)
          
            let result = `Category: ${heirarchy?.map(x=>x).join(" > ") ?? ''}`

           
            return [result];
          }
          else {
            return []
          }
        },
      },

    ]
  };

  ngOnInit(): void {

    this.productContent$.pipe().subscribe(x => {
      if (x) {
        this.list = x
      }

    })

        this.nodes$.pipe().subscribe(x => {
      if (x.length > 0) {
        this.categories = x
      }

    })

  }

  ngOnDestroy() {
    this.dashboardService.clear();

  }

  ngAfterViewInit(): void {

    this.setUpResizeObserver();

    this.gridTemplate = { [this.status]: this.statusTemplate, [this.actions]: this.actionTemplate };

  }



  setUpResizeObserver(): void {
    this.observer = new ResizeObserver(_ => {
      const height = this.headerRef?.nativeElement?.offsetHeight ?? 0;
      this.gridHeight = `calc(100vh - ${height+64}px)`;
    });

    this.observer.observe(this.headerRef.nativeElement);
  }


  getNextPage(e: PageEvent) {
    this.queryParams.pageSize = e.pageSize;

    this.getFilteredData(this.searchQuery, e.pageIndex)

  }

  getFilteredData(event: SearchQueryValue | null, pageNumber?: number) {

    this.queryParams.pageNumber = pageNumber ?? 0


    let request: ProductSearchRequest = {
      name: event?.genericSearchTerm,
      lastUpdatedStart: event?.advancedSearchQuery?.find(x => x.key === this.lastUpdated)?.dateRangeConfig?.startDate,
      lastUpdatedEnd: event?.advancedSearchQuery?.find(x => x.key === this.lastUpdated)?.dateRangeConfig?.endDate,
      sku: event?.advancedSearchQuery?.find(x => x.key === this.sku)?.value,
      inStock: event?.advancedSearchQuery?.find(x => x.key === this.status)?.value,
      categoryId:  event?.advancedSearchQuery?.find(x => x.key === this.categoryId)?.value,
      pageNumber: pageNumber ?? 0,
      pageSize: this.queryParams.pageSize
    }


    this.searchQuery = event
    this.dashboardService.search(request)
  }

  openViewDialog(rowData?: ProductResponse)
  {

     this.dialog.open(ProductEditDialogComponent, {
              disableClose:true,
              data: rowData?.id,
              width: "50vw"
            })
  }

  deleteProduct(id: string)
  {

    let dialogContent : ConfirmationDialogContent = {message: "Are you sure you want to delete this product?", 
      buttons:DialogButtonText.NoYes}

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogContent,
      disableClose: true,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
     this.dashboardService.delete(id);
      }
    });

   
  }



}
export type ProductKeys = keyof ProductResponse;

