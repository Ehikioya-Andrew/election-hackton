import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerStationDashboardComponent } from './power-station-dashboard.component';

describe('PowerStationDashboardComponent', () => {
  let component: PowerStationDashboardComponent;
  let fixture: ComponentFixture<PowerStationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerStationDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerStationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
