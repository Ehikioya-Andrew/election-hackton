import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerSourceFormComponent } from './power-source-form.component';

describe('PowerSourceFormComponent', () => {
  let component: PowerSourceFormComponent;
  let fixture: ComponentFixture<PowerSourceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerSourceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerSourceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
