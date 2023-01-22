import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingBlockComponent } from './reporting-block.component';

describe('ReportingBlockComponent', () => {
  let component: ReportingBlockComponent;
  let fixture: ComponentFixture<ReportingBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
