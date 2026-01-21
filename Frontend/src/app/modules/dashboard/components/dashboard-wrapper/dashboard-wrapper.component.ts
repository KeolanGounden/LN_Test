import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MtxGrid, MtxGridCellTemplate, MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { DashboardState } from '../../states/dashboard.state';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TakealotContentResponse, TakealotSearchRequest } from '../../../ct-client';
import { AsyncPipe } from '@angular/common';
import { ClearDashboardState, SearchTakealotContent } from '../../actions/dashboard.action';
import { PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { HeaderGroupComponent } from '../../../shared/components/header-group/header-group.component';
import { HeaderConfig } from '../../../shared/models/header-config.model';
import { AdvancedSearchConfig, SearchQueryValue } from '../../../shared/models/advanced-search-config.model';
import { ButtonConfig, ButtonType } from '../../../shared/models/button-config.model';
import { MtxDrawer, MtxDrawerModule } from '@ng-matero/extensions/drawer';
import { TableReorderDrawerComponent } from '../../../shared/components/table-reorder-drawer/table-reorder-drawer.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewItemMetadataDialogComponent } from '../view-item-metadata-dialog/view-item-metadata-dialog.component';
import { Router } from '@angular/router';
import { HubConnectionState } from '@microsoft/signalr';
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-dashboard-wrapper',
  imports: [MtxGridModule, AsyncPipe, MatCardModule, HeaderGroupComponent, MtxDrawerModule, MatMenuModule, MatIconModule,MatButtonModule],
  templateUrl: './dashboard-wrapper.component.html',
  styleUrl: './dashboard-wrapper.component.scss'
})
export class DashboardWrapperComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('headerRef') headerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('table') table!: MtxGrid;

  @ViewChild('linkTemplate', { static: true }) linkTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  observer: ResizeObserver | undefined;
  gridHeight = "100vh"

  queryParams: TakealotSearchRequest = { pageSize: 25, pageNumber: 0 }

  headerIcon: boolean = true

  headerConfig: HeaderConfig[] = [
    {
      id: "content", title: "Takealot Content",
      headerButton: {
        type: ButtonType.Badge,
        label: "Global",
        action: () => { }
      },
      selected: true
    },
    {
      title: "Home", subtitle: "", id: "home", headerFunctionCallback: () => {
        this._ngZone.run(() => {
          this._router.navigateByUrl('')
        })
      }
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
      icon: "update",
      action: () => { this.getFilteredData(this.searchQuery, this.queryParams.pageNumber) },
      type: ButtonType.Icon,
      label: "Auto Refresh Settings",
      tooltip: "Auto Refresh Settings"
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
      icon: "arrow_circle_down",
      type: ButtonType.Flat,
      action: () => {

        const drawerRef = this.drawer.open(TableReorderDrawerComponent, {
          width: '320px',
          position: 'right',
          data: this.table,
          hasBackdrop: true
        })

        drawerRef.afterDismissed().subscribe(result => {
          this.getFilteredData(this.searchQuery, this.queryParams.pageNumber);
        });
      },
      tooltip: "Downlink",
      label: "Downlink"
    },
    {
      icon: "add_task",
      action: () => { this._router.navigate(['/find-item']) },
      type: ButtonType.Flat,
      tooltip: "Add Task",
      label: "Add Task"
    }
  ]



  searchQuery: SearchQueryValue | null = {
    genericSearchTerm: '',
    advancedSearchQuery: []
  }

  constructor(private _store: Store, private cdr: ChangeDetectorRef, private drawer: MtxDrawer, private dialog: MatDialog, private _ngZone: NgZone, private _router: Router) {
    this._store.dispatch(new SearchTakealotContent({
      name: "",
      pageNumber: 0,
      pageSize: 25
    }))

  }



  loading$: Observable<boolean | undefined> = this._store.select(DashboardState.isLoading)
  takealotContentCount$: Observable<number> = this._store.select(DashboardState.GetTakealotContentCount)
  takealotContent$: Observable<TakealotContentResponse[] | undefined | null> = this._store.select(DashboardState.GetTakealotContent)

  id: TakealotKeys = 'id';
  name: TakealotKeys = 'name';
  lastUpdated: TakealotKeys = 'lastUpdated';
  productIdentifier: TakealotKeys = 'productIdentifier';
  status: TakealotKeys = 'inStock';
  url: TakealotKeys = 'url';
  actions:string = 'actions'

  columns: MtxGridColumn[] = [
    { header: 'Identifier', field: this.id, disabled: true },
    { header: 'Name', field: this.name },
    {
      header: 'Last Updated', field: this.lastUpdated, formatter(rowData, colDef) {
        return new Date(rowData.lastUpdated).toLocaleDateString()
      },
    },
    { header: 'Product Identifier', field: this.productIdentifier },
    { header: 'Stock Status', field: this.status, },
    { header: 'Product Link', field: this.url, type: 'link' },
    {
      header: 'Actions', field: this.actions, type: 'button', disabled: true
    }
  ];

  gridTemplate: MtxGridCellTemplate = { [this.status]: this.statusTemplate, [this.url]: this.linkTemplate, [this.actions]: this.actionTemplate };

  list: TakealotContentResponse[] = [];

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
        key: this.productIdentifier,
        label: "Product Identifier",
        type: "text",
        placeholder: "Product Identifier",
        filterDisplay: (config, value: string) => {
          if (value) {
            var result = `Product Identifier contains: ${value}`
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

    ]
  };

  ngOnInit(): void {

    this.takealotContent$.pipe().subscribe(x => {
      if (x) {
        this.list = x
      }

    })

  }

  ngOnDestroy() {
    this._store.dispatch(new ClearDashboardState());

  }

  ngAfterViewInit(): void {

    this.setUpResizeObserver();

    this.gridTemplate = { [this.status]: this.statusTemplate, [this.url]: this.linkTemplate, [this.actions]: this.actionTemplate };

  }



  setUpResizeObserver(): void {
    this.observer = new ResizeObserver(_ => {
      const height = this.headerRef?.nativeElement?.offsetHeight ?? 0;
      this.gridHeight = `calc(100vh - ${height}px)`;
    });

    this.observer.observe(this.headerRef.nativeElement);
  }


  getNextPage(e: PageEvent) {
    this.queryParams.pageSize = e.pageSize;

    this.getFilteredData(this.searchQuery, e.pageIndex)

  }

  getFilteredData(event: SearchQueryValue | null, pageNumber?: number) {

    this.queryParams.pageNumber = pageNumber ?? 0


    let request: TakealotSearchRequest = {
      name: event?.genericSearchTerm,
      last_updated_start: event?.advancedSearchQuery?.find(x => x.key === this.lastUpdated)?.dateRangeConfig?.startDate,
      last_updated_end: event?.advancedSearchQuery?.find(x => x.key === this.lastUpdated)?.dateRangeConfig?.endDate,
      product_id: event?.advancedSearchQuery?.find(x => x.key === this.productIdentifier)?.value,
      in_stock: event?.advancedSearchQuery?.find(x => x.key === this.status)?.value,
      pageNumber: pageNumber ?? 0,
      pageSize: this.queryParams.pageSize
    }


    this.searchQuery = event

    this._store.dispatch(new SearchTakealotContent(request))
  }

  openViewDialog(rowData: TakealotContentResponse)
  {

     this.dialog.open(ViewItemMetadataDialogComponent, {
              disableClose:true,
              data: rowData,
              width: "50vw"
            })

  }

  openGraphDialog(rowData: TakealotContentResponse)
  {

   

  }


}
export type TakealotKeys = keyof TakealotContentResponse;

