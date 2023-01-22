import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterStatusToggleComponent } from './meter-status-toggle.component';

describe('MeterStatusToggleComponent', () => {
  let component: MeterStatusToggleComponent;
  let fixture: ComponentFixture<MeterStatusToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterStatusToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterStatusToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
