import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductEditDialogComponent } from './product-edit-dialog.component';



describe('ViewItemMetadataDialogComponent', () => {
  let component: ProductEditDialogComponent;
  let fixture: ComponentFixture<ProductEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
