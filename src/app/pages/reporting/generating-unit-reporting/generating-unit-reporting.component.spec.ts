import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratingUnitReportingComponent } from './generating-unit-reporting.component';

describe('GeneratingUnitReportingComponent', () => {
  let component: GeneratingUnitReportingComponent;
  let fixture: ComponentFixture<GeneratingUnitReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratingUnitReportingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratingUnitReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
