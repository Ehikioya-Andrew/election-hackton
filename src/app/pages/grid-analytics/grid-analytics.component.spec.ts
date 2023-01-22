import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridAnalyticsComponent } from './grid-analytics.component';

describe('GridAnalyticsComponent', () => {
  let component: GridAnalyticsComponent;
  let fixture: ComponentFixture<GridAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
