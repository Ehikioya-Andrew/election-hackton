import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditBlockComponent } from './audit-block.component';

describe('AuditBlockComponent', () => {
  let component: AuditBlockComponent;
  let fixture: ComponentFixture<AuditBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
