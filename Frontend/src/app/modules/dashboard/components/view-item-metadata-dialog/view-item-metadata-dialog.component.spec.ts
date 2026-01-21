import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewItemMetadataDialogComponent } from './view-item-metadata-dialog.component';

describe('ViewItemMetadataDialogComponent', () => {
  let component: ViewItemMetadataDialogComponent;
  let fixture: ComponentFixture<ViewItemMetadataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewItemMetadataDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewItemMetadataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
