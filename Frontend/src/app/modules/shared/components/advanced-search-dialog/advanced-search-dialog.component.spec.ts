import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFilterDialogComponent } from './advanced-search-dialog.component';

describe('AdvancedSearchDialogComponent', () => {
  let component: ReportFilterDialogComponent;
  let fixture: ComponentFixture<ReportFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportFilterDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
