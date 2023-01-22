import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPointAnalyticsSummaryComponent } from './load-point-analytics-summary.component';

describe('LoadPointAnalyticsSummaryComponent', () => {
  let component: LoadPointAnalyticsSummaryComponent;
  let fixture: ComponentFixture<LoadPointAnalyticsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadPointAnalyticsSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadPointAnalyticsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
