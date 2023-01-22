import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratingSetDashboardComponent } from './generating-set-dashboard.component';

describe('GeneratingSetDashboardComponent', () => {
  let component: GeneratingSetDashboardComponent;
  let fixture: ComponentFixture<GeneratingSetDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratingSetDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratingSetDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
