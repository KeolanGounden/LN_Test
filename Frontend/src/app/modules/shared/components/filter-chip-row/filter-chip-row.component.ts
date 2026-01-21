import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FilterChipComponent } from '../filter-chip/filter-chip.component';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AdvancedSearchQuery, FilterRemovedEvent } from '../../models/advanced-search-config.model';

@Component({
  selector: 'app-filter-chip-row',
  imports: [FilterChipComponent, MatChipsModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './filter-chip-row.component.html',
  styleUrl: './filter-chip-row.component.scss'
})
export class FilterChipRowComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() config: AdvancedSearchQuery[] | null = null;
  @Output() filterChanged = new EventEmitter<FilterRemovedEvent>();
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;


  showLeft = false;
  showRight = false;

  onFilterRemoved(event: string, index?: number) {
    this.filterChanged.emit({ event, index });
    setTimeout(() => {
      this.updateScrollButtons()
    }, 50);
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

  ngAfterViewInit() {

    const scrollEl = this.scrollContainer.nativeElement;

    scrollEl.addEventListener('scroll',
      () => this.updateScrollButtons()
    );

    window.addEventListener('resize',
      () => this.updateScrollButtons()
    );

    this.updateScrollButtons();
  }

  ngOnDestroy(): void {
    const scrollEl = this.scrollContainer.nativeElement;

    scrollEl.removeEventListener('scroll',
      () => this.updateScrollButtons()
    );

    window.removeEventListener('resize',
      () => this.updateScrollButtons()
    )
  }

  private updateScrollButtons() {
    const el = this.scrollContainer.nativeElement;

    this.showLeft = el.scrollLeft > 0;
    this.showRight = el.scrollLeft + el.clientWidth < el.scrollWidth;
  }

}

