import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesWrapperComponent } from './categories-wrapper.component';

describe('CategoriesWrapperComponent', () => {
  let component: CategoriesWrapperComponent;
  let fixture: ComponentFixture<CategoriesWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
