import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom, isObservable, Observable } from 'rxjs';

@Component({
  selector: 'app-filter-chip',
  imports: [MatChipsModule, MatIconModule, CommonModule, MatButtonModule],
  templateUrl: './filter-chip.component.html',
  styleUrl: './filter-chip.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FilterChipComponent implements OnChanges {
  @Input() config!: FilterChipConfig
  @Output() filterChanged = new EventEmitter<FilterChipConfig>();

  @Output() editClicked = new EventEmitter<void>();

  filterRemoved() {
    this.filterChanged.emit(this.config);
  }

  openDialog() {
    this.editClicked.emit();
  }



  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['buttonConfig']?.currentValue?.label) {
      const value = changes['buttonConfig'].currentValue.label;

      if (isObservable(value)) 
      {
        this.config.label = await firstValueFrom(value as Observable<string>);
      }
      else 
      {
        this.config.label = value ?? '';

      }
    }
  }


}
export class FilterChipConfig {
  key?: string;
  id?: any;
  label?: string | Observable<string>;
  required?: boolean;
}


