import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StreetLightMarkerInfoComponent } from './street-light-marker-info';

describe('StreetLightMarkerInfoComponent', () => {
  let component: StreetLightMarkerInfoComponent;
  let fixture: ComponentFixture<StreetLightMarkerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreetLightMarkerInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreetLightMarkerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
