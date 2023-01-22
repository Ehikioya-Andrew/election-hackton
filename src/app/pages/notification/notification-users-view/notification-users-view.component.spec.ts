import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationUsersViewComponent } from './notification-users-view.component';

describe('NotificationUsersViewComponent', () => {
  let component: NotificationUsersViewComponent;
  let fixture: ComponentFixture<NotificationUsersViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationUsersViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationUsersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
