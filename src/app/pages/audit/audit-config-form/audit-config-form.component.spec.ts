import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditConfigFormComponent } from './audit-config-form.component';

describe('AuditConfigFormComponent', () => {
  let component: AuditConfigFormComponent;
  let fixture: ComponentFixture<AuditConfigFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditConfigFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
