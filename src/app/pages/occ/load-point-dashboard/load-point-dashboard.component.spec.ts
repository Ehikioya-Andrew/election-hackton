import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPointDashboardComponent } from './load-point-dashboard.component';

describe('LoadPointDashboardComponent', () => {
  let component: LoadPointDashboardComponent;
  let fixture: ComponentFixture<LoadPointDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadPointDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadPointDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
