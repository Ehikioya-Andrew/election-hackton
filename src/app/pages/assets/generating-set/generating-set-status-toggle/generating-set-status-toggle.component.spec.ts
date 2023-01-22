import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratingSetStatusToggleComponent } from './generating-set-status-toggle.component';

describe('GeneratingSetStatusToggleComponent', () => {
  let component: GeneratingSetStatusToggleComponent;
  let fixture: ComponentFixture<GeneratingSetStatusToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratingSetStatusToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratingSetStatusToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
