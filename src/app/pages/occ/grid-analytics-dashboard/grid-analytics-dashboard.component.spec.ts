import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridAnalyticsDashboardComponent } from './grid-analytics-dashboard.component';

describe('GridAnalyticsDashboardComponent', () => {
  let component: GridAnalyticsDashboardComponent;
  let fixture: ComponentFixture<GridAnalyticsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridAnalyticsDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridAnalyticsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
