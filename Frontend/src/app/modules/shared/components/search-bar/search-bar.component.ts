import { Component, ElementRef, EventEmitter, input, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { AdvancedSearchConfig, AdvancedSearchDialogData, FilterRemovedEvent, SearchQueryValue } from '../../models/advanced-search-config.model';
import { AdvancedSearchDialogComponent } from '../advanced-search-dialog/advanced-search-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { FilterChipRowComponent } from '../filter-chip-row/filter-chip-row.component';
import { debounce, debounceTime } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search-bar',
  imports: [FilterChipRowComponent, MatDividerModule, CommonModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatDialogModule, MatChipsModule, MatButtonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent implements OnInit {

  searchForm: FormGroup<SearchForm> = new FormGroup<SearchForm>({
    term: new FormControl<string>(''),
  });

  @Input() config: AdvancedSearchConfig | null = null;

  @Input() searchQuery: SearchQueryValue | null = null;

  @Input() filterTemplate: TemplateRef<any> | null = null;

  @Input() displayFilterList: boolean = false;

  @Output() queryChanged = new EventEmitter<SearchQueryValue | null>();

  @ViewChild('searchContainer') searchContainer!: ElementRef;

  isSearchOpen = false;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.searchForm = new FormGroup<SearchForm>({
      term: new FormControl<string | null>(this.searchQuery?.genericSearchTerm || null),
    });

    if (this.searchQuery?.genericSearchTerm !== null && this.searchQuery?.genericSearchTerm !== "") {
      this.isSearchOpen = true
    }

    this.searchForm.valueChanges.pipe(debounceTime(300)).subscribe(form => {
      let queryString = form.term ? form.term.trim() : '';
      let searchQuery: SearchQueryValue = {
        genericSearchTerm: queryString,
        advancedSearchQuery: this.searchQuery?.advancedSearchQuery
      };
      this.queryChanged.emit(searchQuery);
    });

  }
  openSearchInput(input: HTMLInputElement) {
    this.isSearchOpen = true;
    setTimeout(() => input.focus(), 0);
  }

  closeSearchInput(event: FocusEvent) {
    setTimeout(() => {
      const term = this.searchForm.get('term')?.value;
      const targetElement = event.relatedTarget as HTMLElement;

      // Check if the click is within the search container
      if (!this.searchContainer.nativeElement.contains(targetElement) && !term) {
        this.isSearchOpen = false;
      }
    }, 100);
  }

  closeSearchExplicit() {
    this.isSearchOpen = false;
    this.searchForm.get('term')?.setValue('');
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeSearchExplicit();
    }
  }

  openAdvancedDialog() {
    if (this.config) {
      this.config.generic.value = this.searchForm.controls.term.value || '';
      const dialogRef = this.dialog.open(AdvancedSearchDialogComponent, {
        width: '400px',
        data: <AdvancedSearchDialogData>{ config: this.config, value: this.searchQuery }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && this.config) {

          let generic = result.generic || '';
          delete result.generic

          this.searchForm.controls.term.setValue(generic, { emitEvent: false });

          let searchQuery: SearchQueryValue = {
            genericSearchTerm: generic,
            advancedSearchQuery: []
          };

          for (const key in result) {

            let field = this.config?.fields.find(x => x.key === key)

            if (field) {

              let value = result[key];

              if (field.type === 'dateRange') {
                if (!result[key + '_start'] && !result[key + '_end']) {
                  value = null;
                } else {
                  value = {
                    startDate: result[key + '_start'] || null,
                    endDate: result[key + '_end'] || null
                  };
                }
              }

              let label = field.filterDisplay(this.config, value)

              let inclusive = field.selectOptions?.multiple && field.selectOptions?.displayInclusive ? result[key + '_inclusive'] : false;

              if (searchQuery.advancedSearchQuery) {
                searchQuery.advancedSearchQuery.push({
                  key: key,
                  value: value,
                  label: Array.isArray(label) ? label : [label],
                  selectConfig: field.type === 'select' ? {
                    multiple: field.selectOptions?.multiple,
                    inclusive: inclusive
                  } : undefined,
                  dateRangeConfig: field.type === 'dateRange' && value ? value : undefined
                })
              }

            }

          }

          this.queryChanged.emit(searchQuery);



        }
      });
    }

  }

  filterRemoved(event: FilterRemovedEvent) {
    if (this.config) {
      if (event.index != undefined && this.searchQuery) {

        this.searchQuery.advancedSearchQuery?.find(x => x.key === event.event)?.value.splice(event.index, 1);
        this.searchQuery.advancedSearchQuery?.find(x => x.key === event.event)?.label.splice(event.index, 1);

      }
      else {
        if (this.searchQuery) {
          const target = this.searchQuery.advancedSearchQuery?.find(x => x.key === event.event);
          if (target?.value != undefined || target?.value != null) {
            target.value = null;
          }

          if (this.config.fields.find(x => x.key === event.event)?.type === 'dateRange') {
            const target = this.searchQuery.advancedSearchQuery?.find(x => x.key === event.event);
            if (target) {
              target.dateRangeConfig = {
                startDate: null,
                endDate: null
              };
            }


          }
        }


      }

      this.queryChanged.emit(this.searchQuery);

    }
  }

  clearSearch() {
    this.searchForm.controls.term.setValue('');
    if (this.searchQuery) {
      this.searchQuery.genericSearchTerm = '';
    }
    this.queryChanged.emit(this.searchQuery);
  }

}



interface SearchForm {
  term: FormControl<string | null>;
}

