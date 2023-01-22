import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratingUnitAnalyticsComponent } from './generating-unit-analytics.component';

describe('GeneratingUnitAnalyticsComponent', () => {
  let component: GeneratingUnitAnalyticsComponent;
  let fixture: ComponentFixture<GeneratingUnitAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratingUnitAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratingUnitAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
