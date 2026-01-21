import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableReorderDrawerComponent } from './table-reorder-drawer.component';

describe('TableReorderDrawerComponent', () => {
  let component: TableReorderDrawerComponent;
  let fixture: ComponentFixture<TableReorderDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableReorderDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableReorderDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
