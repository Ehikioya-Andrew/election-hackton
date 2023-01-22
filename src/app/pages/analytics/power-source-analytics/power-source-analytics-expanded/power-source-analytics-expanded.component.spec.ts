import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerSourceAnalyticsExpandedComponent } from './power-source-analytics-expanded.component';

describe('PowerSourceAnalyticsExpandedComponent', () => {
  let component: PowerSourceAnalyticsExpandedComponent;
  let fixture: ComponentFixture<PowerSourceAnalyticsExpandedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerSourceAnalyticsExpandedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerSourceAnalyticsExpandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
