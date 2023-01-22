import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerSourceGisComponent } from './power-source-gis.component';

describe('PowerSourceGisComponent', () => {
  let component: PowerSourceGisComponent;
  let fixture: ComponentFixture<PowerSourceGisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerSourceGisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerSourceGisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
