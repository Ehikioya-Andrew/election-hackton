import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPointColumnComponent } from './load-point-column.component';

describe('LoadPointColumnComponent', () => {
  let component: LoadPointColumnComponent;
  let fixture: ComponentFixture<LoadPointColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadPointColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadPointColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
