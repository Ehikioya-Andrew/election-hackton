import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPointGisComponent } from './load-point-gis.component';

describe('LoadPointGisComponent', () => {
  let component: LoadPointGisComponent;
  let fixture: ComponentFixture<LoadPointGisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadPointGisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadPointGisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
