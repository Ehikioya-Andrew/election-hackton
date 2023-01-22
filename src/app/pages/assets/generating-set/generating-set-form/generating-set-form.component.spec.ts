import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratingSetFormComponent } from './generating-set-form.component';

describe('GeneratingSetFormComponent', () => {
  let component: GeneratingSetFormComponent;
  let fixture: ComponentFixture<GeneratingSetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratingSetFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratingSetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
