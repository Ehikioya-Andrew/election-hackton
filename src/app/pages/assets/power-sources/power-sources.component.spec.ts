import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerSourcesComponent } from './power-sources.component';

describe('PowerSourcesComponent', () => {
  let component: PowerSourcesComponent;
  let fixture: ComponentFixture<PowerSourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerSourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
