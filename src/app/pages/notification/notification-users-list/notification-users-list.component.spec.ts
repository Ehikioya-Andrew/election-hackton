import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationUsersListComponent } from './notification-users-list.component';

describe('NotificationUsersListComponent', () => {
  let component: NotificationUsersListComponent;
  let fixture: ComponentFixture<NotificationUsersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationUsersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
