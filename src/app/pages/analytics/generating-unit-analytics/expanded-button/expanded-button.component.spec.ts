import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedButtonComponent } from './expanded-button.component';

describe('ExpandedButtonComponent', () => {
  let component: ExpandedButtonComponent;
  let fixture: ComponentFixture<ExpandedButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpandedButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandedButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
