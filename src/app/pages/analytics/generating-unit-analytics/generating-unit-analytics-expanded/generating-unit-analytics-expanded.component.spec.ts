import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratingUnitAnalyticsExpandedComponent } from './generating-unit-analytics-expanded.component';

describe('GeneratingUnitAnalyticsExpandedComponent', () => {
  let component: GeneratingUnitAnalyticsExpandedComponent;
  let fixture: ComponentFixture<GeneratingUnitAnalyticsExpandedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratingUnitAnalyticsExpandedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratingUnitAnalyticsExpandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
