import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingConfigFormComponent } from './reporting-config-form.component';

describe('ReportingConfigFormComponent', () => {
  let component: ReportingConfigFormComponent;
  let fixture: ComponentFixture<ReportingConfigFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingConfigFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
