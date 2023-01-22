import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerSourceAnalyticsSummaryComponent } from './power-source-analytics-summary.component';

describe('PowerSourceAnalyticsSummaryComponent', () => {
  let component: PowerSourceAnalyticsSummaryComponent;
  let fixture: ComponentFixture<PowerSourceAnalyticsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerSourceAnalyticsSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerSourceAnalyticsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
