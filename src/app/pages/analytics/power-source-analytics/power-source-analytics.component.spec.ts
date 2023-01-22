import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerSourceAnalyticsComponent } from './power-source-analytics.component';

describe('PowerSourceAnalyticsComponent', () => {
  let component: PowerSourceAnalyticsComponent;
  let fixture: ComponentFixture<PowerSourceAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerSourceAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerSourceAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
