import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPointStatusToggleComponent } from './load-point-status-toggle.component';

describe('LoadPointStatusToggleComponent', () => {
  let component: LoadPointStatusToggleComponent;
  let fixture: ComponentFixture<LoadPointStatusToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadPointStatusToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadPointStatusToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
