import { afterNextRender, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FilterChipComponent, FilterChipConfig } from '../filter-chip/filter-chip.component';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AdvancedSearchQuery } from '../../models/advanced-search-config.model';

@Component({
  selector: 'app-filter-chip-row',
  imports: [FilterChipComponent, MatChipsModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './filter-chip-row.component.html',
  styleUrl: './filter-chip-row.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FilterChipRowComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() config: AdvancedSearchQuery[] | null = null;
  @Output() filterChanged = new EventEmitter<FilterChipConfig>();
  @Output() editClicked = new EventEmitter<FilterChipConfig>();
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  observer: ResizeObserver = new ResizeObserver(() => { });

  showLeft = false;
  showRight = false;

  constructor() {
    afterNextRender(() => {
      this.setUpResizeObserver();

    })
  }
  ngAfterViewInit() {

    const scrollEl = this.scrollContainer.nativeElement;

    scrollEl.addEventListener('scroll',
      () => this.updateScrollButtons()
    );

    this.observer = new ResizeObserver(_ => {
      this.updateScrollButtons();
    });

    this.updateScrollButtons();
  }

  ngOnDestroy(): void {
    const scrollEl = this.scrollContainer.nativeElement;


    this.observer.unobserve(scrollEl);


  }

  setUpResizeObserver(): void {
    let element = this.scrollContainer.nativeElement

    if (element) {
      this.observer.observe(element);
    }
  }

  onFilterRemoved(config: FilterChipConfig) {
    this.filterChanged.emit(config);
    setTimeout(() => {
      this.updateScrollButtons()
    }, 50);
  }

  openDialog() {
    this.editClicked.emit();
  }


  scrollLeft() {
    const el = this.scrollContainer.nativeElement;
    const maxScrollLeft = el.scrollLeft;
    const scrollAmount = Math.min(150, maxScrollLeft);

    el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }

  scrollRight() {
    const el = this.scrollContainer.nativeElement;
    const maxScrollRight = el.scrollWidth - el.clientWidth - el.scrollLeft;
    const scrollAmount = Math.min(150, maxScrollRight);

    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  ngOnChanges(changes: SimpleChanges): void {

    setTimeout(() => {
      this.updateScrollButtons()
    }, 50)

  }



  private updateScrollButtons() {
    const el = this.scrollContainer.nativeElement;

    this.showLeft = el.scrollLeft > 0;
    this.showRight = el.scrollLeft + el.clientWidth < el.scrollWidth;
  }

}

