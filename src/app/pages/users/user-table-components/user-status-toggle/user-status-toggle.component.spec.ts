import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStatusToggleComponent } from './user-status-toggle.component';

describe('UserStatusToggleComponent', () => {
  let component: UserStatusToggleComponent;
  let fixture: ComponentFixture<UserStatusToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserStatusToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStatusToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
