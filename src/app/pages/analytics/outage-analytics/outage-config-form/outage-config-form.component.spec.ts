import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OutageConfigFormComponent } from './outage-config-form.component';

import { ReportingConfigFormComponent } from './reporting-config-form.component';

describe('ReportingConfigFormComponent', () => {
  let component: OutageConfigFormComponent;
  let fixture: ComponentFixture<OutageConfigFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutageConfigFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutageConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
