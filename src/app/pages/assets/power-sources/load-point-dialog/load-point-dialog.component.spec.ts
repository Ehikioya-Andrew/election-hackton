import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPointDialogComponent } from './load-point-dialog.component';

describe('LoadPointDialogComponent', () => {
  let component: LoadPointDialogComponent;
  let fixture: ComponentFixture<LoadPointDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadPointDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadPointDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
