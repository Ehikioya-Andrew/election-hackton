import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratingSetGisComponent } from './generating-set-gis.component';

describe('GeneratingSetGisComponent', () => {
  let component: GeneratingSetGisComponent;
  let fixture: ComponentFixture<GeneratingSetGisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratingSetGisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratingSetGisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
