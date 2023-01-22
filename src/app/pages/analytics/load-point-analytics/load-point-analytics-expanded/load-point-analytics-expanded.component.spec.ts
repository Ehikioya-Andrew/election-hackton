import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPointAnalyticsExpandedComponent } from './load-point-analytics-expanded.component';

describe('LoadPointAnalyticsExpandedComponent', () => {
  let component: LoadPointAnalyticsExpandedComponent;
  let fixture: ComponentFixture<LoadPointAnalyticsExpandedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadPointAnalyticsExpandedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadPointAnalyticsExpandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
