import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBandFormComponent } from './service-band-form.component';

describe('ServiceBandFormComponent', () => {
  let component: ServiceBandFormComponent;
  let fixture: ComponentFixture<ServiceBandFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceBandFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceBandFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
