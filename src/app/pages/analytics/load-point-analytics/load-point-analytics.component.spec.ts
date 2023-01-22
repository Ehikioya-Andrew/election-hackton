import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPointAnalyticsComponent } from './load-point-analytics.component';

describe('LoadPointAnalyticsComponent', () => {
  let component: LoadPointAnalyticsComponent;
  let fixture: ComponentFixture<LoadPointAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadPointAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadPointAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
