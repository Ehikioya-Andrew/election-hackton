import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsBlockComponent } from './analytics-block.component';

describe('AnalyticsBlockComponent', () => {
  let component: AnalyticsBlockComponent;
  let fixture: ComponentFixture<AnalyticsBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticsBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
