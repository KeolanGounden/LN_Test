import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterChipRowComponent } from './filter-chip-row.component';

describe('FilterChipRowComponent', () => {
  let component: FilterChipRowComponent;
  let fixture: ComponentFixture<FilterChipRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterChipRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterChipRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
