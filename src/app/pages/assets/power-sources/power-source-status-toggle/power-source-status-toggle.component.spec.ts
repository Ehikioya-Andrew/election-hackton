import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerSourceStatusToggleComponent } from './power-source-status-toggle.component';

describe('PowerSourceStatusToggleComponent', () => {
  let component: PowerSourceStatusToggleComponent;
  let fixture: ComponentFixture<PowerSourceStatusToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerSourceStatusToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerSourceStatusToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
