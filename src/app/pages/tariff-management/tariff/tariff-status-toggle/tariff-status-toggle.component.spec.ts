import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffStatusToggleComponent } from './tariff-status-toggle.component';

describe('TariffStatusToggleComponent', () => {
  let component: TariffStatusToggleComponent;
  let fixture: ComponentFixture<TariffStatusToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TariffStatusToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TariffStatusToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
