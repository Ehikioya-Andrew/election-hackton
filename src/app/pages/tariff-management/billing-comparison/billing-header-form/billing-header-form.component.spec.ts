import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingHeaderFormComponent } from './billing-header-form.component';

describe('BillingHeaderFormComponent', () => {
  let component: BillingHeaderFormComponent;
  let fixture: ComponentFixture<BillingHeaderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingHeaderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingHeaderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
