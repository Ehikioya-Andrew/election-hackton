import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingComparisonComponent } from './billing-comparison.component';

describe('BillingComparisonComponent', () => {
  let component: BillingComparisonComponent;
  let fixture: ComponentFixture<BillingComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingComparisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
