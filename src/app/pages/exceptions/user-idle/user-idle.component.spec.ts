import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIdleComponent } from './user-idle.component';

describe('UserIdleComponent', () => {
  let component: UserIdleComponent;
  let fixture: ComponentFixture<UserIdleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserIdleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserIdleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
