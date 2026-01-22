
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-chip',
  imports: [MatChipsModule, MatIconModule],
  templateUrl: './filter-chip.component.html',
  styleUrl: './filter-chip.component.scss'
})
export class FilterChipComponent {
  @Input() config: FilterChipConfig | null = null;
  @Output() filterChanged = new EventEmitter<string>();

  filterRemoved() {
    this.filterChanged.emit(this.config?.key);
  }
}

export class FilterChipConfig {
  key?: string;
  label?: string;
}
