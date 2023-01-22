import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPointFormComponent } from './load-point-form.component';

describe('LoadPointFormComponent', () => {
  let component: LoadPointFormComponent;
  let fixture: ComponentFixture<LoadPointFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadPointFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadPointFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
