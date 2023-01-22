import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenSetDialogComponent } from './gen-set-dialog.component';

describe('GenSetDialogComponent', () => {
  let component: GenSetDialogComponent;
  let fixture: ComponentFixture<GenSetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenSetDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenSetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
