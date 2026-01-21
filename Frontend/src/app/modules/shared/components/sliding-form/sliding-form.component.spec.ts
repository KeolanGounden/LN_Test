import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidingFormComponent } from './sliding-form.component';

describe('SlidingFormComponent', () => {
  let component: SlidingFormComponent;
  let fixture: ComponentFixture<SlidingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlidingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlidingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
