import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingHeaderBlockComponent } from './billing-header-block.component';

describe('BillingHeaderBlockComponent', () => {
  let component: BillingHeaderBlockComponent;
  let fixture: ComponentFixture<BillingHeaderBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingHeaderBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingHeaderBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
