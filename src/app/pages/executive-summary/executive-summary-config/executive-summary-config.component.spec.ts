import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveSummaryConfigComponent } from './executive-summary-config.component';

describe('ExecutiveSummaryConfigComponent', () => {
  let component: ExecutiveSummaryConfigComponent;
  let fixture: ComponentFixture<ExecutiveSummaryConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutiveSummaryConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveSummaryConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
