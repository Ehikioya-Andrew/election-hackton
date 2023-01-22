import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratingUnitAnalyticsSummaryComponent } from './generating-unit-analytics-summary.component';

describe('GeneratingUnitAnalyticsSummaryComponent', () => {
  let component: GeneratingUnitAnalyticsSummaryComponent;
  let fixture: ComponentFixture<GeneratingUnitAnalyticsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratingUnitAnalyticsSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratingUnitAnalyticsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
