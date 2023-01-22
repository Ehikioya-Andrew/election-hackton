import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBandStatusToggleComponent } from './service-band-status-toggle.component';

describe('ServiceBandStatusToggleComponent', () => {
  let component: ServiceBandStatusToggleComponent;
  let fixture: ComponentFixture<ServiceBandStatusToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceBandStatusToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceBandStatusToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
