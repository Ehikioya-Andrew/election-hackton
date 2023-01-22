import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundSvgComponent } from './not-found-svg.component';

describe('NotFoundSvgComponent', () => {
  let component: NotFoundSvgComponent;
  let fixture: ComponentFixture<NotFoundSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotFoundSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
