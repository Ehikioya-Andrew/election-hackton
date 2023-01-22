import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingStatusToggleComponent } from './billing-status-toggle.component';

describe('BillingStatusToggleComponent', () => {
  let component: BillingStatusToggleComponent;
  let fixture: ComponentFixture<BillingStatusToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingStatusToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingStatusToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
