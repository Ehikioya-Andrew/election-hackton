import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratingSetComponent } from './generating-set.component';

describe('GeneratingSetComponent', () => {
  let component: GeneratingSetComponent;
  let fixture: ComponentFixture<GeneratingSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratingSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratingSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
