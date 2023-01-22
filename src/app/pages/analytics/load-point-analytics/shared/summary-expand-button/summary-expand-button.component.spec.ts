import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryExpandButtonComponent } from './summary-expand-button.component';

describe('SummaryExpandButtonComponent', () => {
  let component: SummaryExpandButtonComponent;
  let fixture: ComponentFixture<SummaryExpandButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryExpandButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryExpandButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
