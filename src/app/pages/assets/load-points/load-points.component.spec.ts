import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPointsComponent } from './load-points.component';

describe('LoadPointComponent', () => {
  let component: LoadPointsComponent;
  let fixture: ComponentFixture<LoadPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadPointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
