import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingComfigureFormComponent } from './billing-comfigure-form.component';

describe('BillingComfigureFormComponent', () => {
  let component: BillingComfigureFormComponent;
  let fixture: ComponentFixture<BillingComfigureFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingComfigureFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingComfigureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
