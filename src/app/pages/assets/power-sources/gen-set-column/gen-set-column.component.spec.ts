import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenSetColumnComponent } from './gen-set-column.component';

describe('GenSetColumnComponent', () => {
  let component: GenSetColumnComponent;
  let fixture: ComponentFixture<GenSetColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenSetColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenSetColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
