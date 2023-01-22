import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerSourceReportingComponent } from './power-source-reporting.component';

describe('PowerSourceReportingComponent', () => {
  let component: PowerSourceReportingComponent;
  let fixture: ComponentFixture<PowerSourceReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerSourceReportingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerSourceReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
