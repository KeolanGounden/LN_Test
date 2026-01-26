import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDashboardWrapperComponent } from './product-dashboard-wrapper.component';



describe('DashboardWrapperComponent', () => {
  let component: ProductDashboardWrapperComponent;
  let fixture: ComponentFixture<ProductDashboardWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDashboardWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDashboardWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
