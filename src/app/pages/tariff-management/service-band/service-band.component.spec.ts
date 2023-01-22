import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBandComponent } from './service-band.component';

describe('ServiceBandComponent', () => {
  let component: ServiceBandComponent;
  let fixture: ComponentFixture<ServiceBandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceBandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceBandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
