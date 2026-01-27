import { afterNextRender, AfterViewInit, Component, ElementRef, EventEmitter, input, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { AdvancedSearchConfig, AdvancedSearchDialogData, SearchQueryValue, SelectOptionConfig, SelectOption, SelectValueConfig } from '../../models/advanced-search-config.model';
import { AdvancedSearchDialogComponent } from '../advanced-search-dialog/advanced-search-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { FilterChipRowComponent } from '../filter-chip-row/filter-chip-row.component';
import { debounceTime, firstValueFrom, isObservable, Observable, of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { FilterChipConfig } from '../filter-chip/filter-chip.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-search-bar',
  imports: [MatTooltipModule, FilterChipRowComponent, MatDividerModule, CommonModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatDialogModule, MatChipsModule, MatButtonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SearchBarComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  searchForm: FormGroup<SearchForm> = new FormGroup<SearchForm>({
    term: new FormControl<string>(''),
  });

  @Input() config: AdvancedSearchConfig | null = null;

  @Input() searchQuery: SearchQueryValue | null = null;

  @Input() filterTemplate: TemplateRef<any> | null = null;

  @Input() displayFilterList: boolean = false;

  @Input() autofocusSearch: boolean = false

  @Input() selectionInput: number = 0

  @Input() clearSelection: () => void;

  @Output() queryChanged = new EventEmitter<SearchQueryValue | null>();

  @ViewChild('searchContainer') searchContainer!: ElementRef;

  @ViewChild('filterChipRow') filterChipRow!: ElementRef<HTMLDivElement>;

  @ViewChild('autofocus') autofocus: ElementRef;

  @ViewChild('selectionCount') selectionCount: ElementRef;

  @ViewChild('totalWidth') totalWidth: ElementRef;



  chipWidth: number = 0;


  observer: ResizeObserver = new ResizeObserver(() => { });

  isSearchOpen = false;

  constructor(private dialog: MatDialog) {
    afterNextRender(() => {
      this.setUpResizeObserver();
    })
  }

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

  ngAfterViewInit(): void {
    this.observer = new ResizeObserver(_ => {
      this.searchQuery.advancedSearchQuery = this.searchQuery?.advancedSearchQuery || [];
      this.chipWidth = this.filterChipRow?.nativeElement?.parentElement.parentElement.parentElement?.offsetWidth - 30 || 0;
    });

    this.focusSearch()
  }

  ngOnDestroy(): void {

    if (this.filterChipRow) {
      this.observer.unobserve(this.filterChipRow?.nativeElement?.parentElement.parentElement.parentElement);
    }


  }





  setUpResizeObserver(): void {
    let element = this.filterChipRow?.nativeElement?.parentElement.parentElement.parentElement

    if (element) {
      this.observer.observe(element);
    }
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

  focusSearch() {
    if (this.autofocusSearch) {
      setTimeout(() => {
        this.autofocus.nativeElement.focus()
      }, 100)
    }

  }

  async openAdvancedDialog() {

    if (this.config) {
      this.config.generic.value = this.searchForm.controls.term.value || '';
      const dialogRef = this.dialog.open(AdvancedSearchDialogComponent, {
        disableClose: true,
        width: '400px',
        data: <AdvancedSearchDialogData>{ config: this.config, value: this.searchQuery }
      });

      dialogRef.afterClosed().subscribe(async result => {

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

              switch (field.type) {
                case 'dateRange': {
                  let value = null
                  if (result[key + '_start'] && result[key + '_end']) {
                    value = {
                      startDate: result[key + '_start'] || null,
                      endDate: result[key + '_end'] || null
                    };
                  }

                  const displayLabel = await field.filterDisplay(this.config, value);
                  searchQuery.advancedSearchQuery?.push({
                    key: key,
                    label: displayLabel,
                    required: field.required ?? false,
                    dateRangeConfig: {
                      startDate: value?.startDate,
                      endDate: value?.endDate
                    }

                  })

                  break;
                }
                case 'date': {
                  let value = result[key]
                  if (value !== undefined && value !== null) {

                    const displayLabel = await field.filterDisplay(this.config, value);
                    searchQuery.advancedSearchQuery?.push({
                      key: key,
                      label: displayLabel,
                      required: field.required ?? false,
                      value: value
                    })
                  }

                  break;

                }

                case 'select': {

                  if (result[key] !== null && result[key] !== undefined) {

                    if (Array.isArray(result[key])) {
                      let value: SelectValueConfig[] = [];

                      if (this.config !== null) {
                        const promises = result[key].map(async (element: SelectOption) => {
                          const label = await field.filterDisplay(this.config, element);

                          return {
                            displayLabel: label,
                            option: {
                              id: element.id,
                              label: element.label,
                              value: element.value
                            }
                          };
                        });

                        value = await Promise.all(promises);
                      }

                      searchQuery.advancedSearchQuery?.push({
                        key: key,
                        label: field.label as string,
                        required: field.required ?? false,
                        selectConfig: {
                          multiSelectValue: value,
                          inclusive: field.selectOptions?.multiple && field.selectOptions?.displayInclusive
                            ? result[key + '_inclusive']
                            : false,
                          multiple: field.selectOptions?.multiple,
                        }
                      });
                    }


                    else {
                      searchQuery.advancedSearchQuery?.push(
                        {
                          key: key,
                          label: field.label as string,
                          required: field.required ?? false,
                          selectConfig: {
                            selectValue: {
                              option: result[key],
                              displayLabel: await field.filterDisplay(this.config, result[key]),
                            },
                            inclusive: field.selectOptions?.multiple && field.selectOptions?.displayInclusive ? result[key + '_inclusive'] : false,
                            multiple: field.selectOptions?.multiple,
                          }
                        }
                      )
                    }

                  }
                  break;
                }

                case 'text': {
                  let value = result[key]
                  if (value !== undefined && value !== null) {

                    if ((!value || value.trim() === "")) {
                      value = null
                    }

                    const displayLabel = await field.filterDisplay(this.config, value);
                    searchQuery.advancedSearchQuery?.push({
                      key: key,
                      label: displayLabel,
                      required: field.required ?? false,
                      value: value
                    })
                  }

                  break;
                }

                case 'virtualSearch': {

                  if (result[key]) {

                    if (Array.isArray(result[key])) {
                      let value: SelectValueConfig[] = [];

                      if (this.config !== null) {
                        const promises = result[key].map(async (element: SelectOption) => {
                          const label = await field.filterDisplay(this.config, element);

                          return {
                            displayLabel: label,
                            option: {
                              id: element.id,
                              label: element.label,
                              value: element.value
                            }
                          };
                        });

                        value = await Promise.all(promises);
                      }

                      searchQuery.advancedSearchQuery?.push({
                        key: key,
                        label: field.label as string,
                        required: field.required ?? false,
                        selectConfig: {
                          multiSelectValue: value,
                          inclusive: field.selectOptions?.multiple && field.selectOptions?.displayInclusive
                            ? result[key + '_inclusive']
                            : false,
                          multiple: field.selectOptions?.multiple,
                        }
                      });
                    }


                    else {
                      const displayLabel = await field.filterDisplay(this.config, result[key]);
                      searchQuery.advancedSearchQuery?.push(
                        {
                          key: key,
                          label: field.label as string,
                          required: field.required ?? false,
                          selectConfig: {
                            selectValue: {
                              option: result[key],
                              displayLabel: displayLabel,
                            },
                            inclusive: field.selectOptions?.multiple && field.selectOptions?.displayInclusive ? result[key + '_inclusive'] : false,
                            multiple: field.selectOptions?.multiple,
                          }
                        }
                      )
                    }

                  }
                  break;
                }

                case 'checkbox': {
                  let value = result[key]
                  if (value !== undefined && value !== null) {

                    let label = await field.filterDisplay(this.config, value)
                    searchQuery.advancedSearchQuery?.push({
                      key: key,
                      label: label,
                      required: field.required ?? false,
                      value: value
                    })
                  }

                  break;
                }

              }
            }

          }

          this.chipWidth = this.filterChipRow?.nativeElement?.parentElement.parentElement.parentElement?.offsetWidth - 30 || 0;
          this.queryChanged.emit(searchQuery);


        }
      });
    }

  }

  filterRemoved(event: FilterChipConfig) {
    if (this.config) {
      if (this.searchQuery) {
        let field = this.config.fields.find(x => x.key === event.key);

        if (field) {
          if (field.type === 'dateRange') {
            const target = this.searchQuery.advancedSearchQuery?.find(x => x.key === event.key);
            if (target) {
              target.dateRangeConfig = {
                startDate: null,
                endDate: null
              };
            }
          }
          else if (field.type === 'select') {
            let target = this.searchQuery.advancedSearchQuery?.find(x => x.key === event.key)

            if (field.selectOptions?.multiple) {

              if (target) {
                let value = target.selectConfig?.multiSelectValue?.find((x: SelectValueConfig) => x.option.id === event.id)
                if (value) {
                  let index = target.selectConfig?.multiSelectValue?.indexOf(value)
                  if (index !== undefined) {
                    target.selectConfig?.multiSelectValue?.splice(index, 1)

                  }
                }


              }
            }
            else {
              let target = this.searchQuery.advancedSearchQuery?.find(x => x.key === event.key)
              if (target) {
                if (target.selectConfig) {
                  target.selectConfig.selectValue = undefined
                }

              }

            }

          }
          else if (field.type === 'virtualSearch') {
            let target = this.searchQuery.advancedSearchQuery?.find(x => x.key === event.key)

            if (field.selectOptions?.multiple) {

              if (target) {
                let value = target.selectConfig?.multiSelectValue?.find((x: SelectValueConfig) => x.option.id === event.id)
                if (value) {
                  let index = target.selectConfig?.multiSelectValue?.indexOf(value)
                  if (index !== undefined) {
                    target.selectConfig?.multiSelectValue?.splice(index, 1)

                  }
                }


              }
            }
            else {
              let target = this.searchQuery.advancedSearchQuery?.find(x => x.key === event.key)
              if (target) {
                if (target.selectConfig) {
                  target.selectConfig.selectValue = undefined
                }

              }

            }

          }
          else {
            let target = this.searchQuery.advancedSearchQuery?.find(x => x.key === event.key)

            if (target) {
              target.value = null
            }

          }
        }


      }


      this.chipWidth = this.filterChipRow?.nativeElement?.parentElement.parentElement.parentElement?.offsetWidth - 30 || 0;
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

  async ngOnChanges(changes: SimpleChanges): Promise<void> {

    if (changes?.config?.currentValue) {

      const currentFields = changes.config.currentValue.fields;
      const currentGeneric = changes.config.currentValue.generic;

      if (currentGeneric) {
        const value = currentGeneric.label;
        const placeholder = currentGeneric.placeholder;
        if (isObservable(value)) {
          currentGeneric.label = await firstValueFrom(value as Observable<string>);
        } else {
          currentGeneric.label = value ?? '';
        }

        if (isObservable(placeholder)) {

          currentGeneric.placeholder = await firstValueFrom(placeholder as Observable<string>);
        } else {
          currentGeneric.placeholder = placeholder ?? '';
        }



        for (const cfg of currentFields) {
          const value = cfg.label;

          if (isObservable(value)) {
            cfg.label = await firstValueFrom(value as Observable<string>);
          } else {
            cfg.label = value ?? '';
          }
        }

        // Assign back after processing
        this.config.fields = currentFields;
        this.config.generic = currentGeneric
      }


    }

  }

  getLabel(label: string | Observable<string>): Observable<string> {
    return typeof label === 'string' ? of(label) : label;
  }

  getSearchbarLength() {
    if (this.selectionCount) {
      let width = this.selectionCount.nativeElement.offsetWidth

      let totalWidth = this.totalWidth.nativeElement.offsetWidth

      let searchWidth = totalWidth - width

      return searchWidth + "px"
    }

    return "100%"

  }
}



interface SearchForm {
  term: FormControl<string | null>;
}

