import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccComponent } from './occ.component';

describe('OccComponent', () => {
  let component: OccComponent;
  let fixture: ComponentFixture<OccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OccComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
