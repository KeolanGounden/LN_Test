import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonConfig } from '../../models/button-config.model';
import { HeaderConfig } from '../../models/header-config.model';
import { AdvancedSearchConfig, SearchQueryValue } from '../../models/advanced-search-config.model';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MtxGridModule } from '@ng-matero/extensions/grid';;
import { PageHeaderComponent } from '../page-header/page-header.component';

import { BreakpointObserver } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatDivider, MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from '@angular/material/button';
import { ButtonRowComponent } from '../button-row/button-row.component';

@Component({
  selector: 'app-header-group',
  imports: [ButtonRowComponent, MatButtonModule, MatDividerModule, MatMenuModule, MatTableModule, MatIconModule, MtxGridModule, MatCardModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, PageHeaderComponent, SearchBarComponent, MatDivider],
  templateUrl: './header-group.component.html',
  styleUrl: './header-group.component.scss'
})
export class HeaderGroupComponent implements OnInit {
  @Input() pageButtons: ButtonConfig[] = [];

  @Input() actionButtons: ButtonConfig[] = [];

  @Input() headerConfig: HeaderConfig[] = [];

  @Input() config: AdvancedSearchConfig | null = null;

  @Output() queryChanged = new EventEmitter<SearchQueryValue | null>();

  @Input() displayFilterList: boolean = false;
  @Input() searchQuery: SearchQueryValue | null = null;

  showPageButtons: boolean = true;



  constructor(private breakpointObserver: BreakpointObserver) {
  }

  searchQueryChanged(query: SearchQueryValue | null) {
    this.queryChanged.emit(query)
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe('(min-width: 768px)')
      .subscribe(({ matches }) => {
        if (matches) {
          this.showPageButtons = true;
        } else {
          this.showPageButtons = false;
        }
      });
  }


}
