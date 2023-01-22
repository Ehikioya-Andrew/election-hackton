import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsConfigFormComponent } from './analytics-config-form.component';

describe('AnalyticsConfigFormComponent', () => {
  let component: AnalyticsConfigFormComponent;
  let fixture: ComponentFixture<AnalyticsConfigFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticsConfigFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
