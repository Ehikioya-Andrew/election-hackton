import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPointReportingComponent } from './load-point-reporting.component';

describe('LoadPointReportingComponent', () => {
  let component: LoadPointReportingComponent;
  let fixture: ComponentFixture<LoadPointReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadPointReportingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadPointReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
