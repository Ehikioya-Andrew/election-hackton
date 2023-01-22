import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidDeviceComponent } from './invalid-device.component';

describe('InvalidDeviceComponent', () => {
  let component: InvalidDeviceComponent;
  let fixture: ComponentFixture<InvalidDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvalidDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
