import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationStatusToggleComponent } from './notification-status-toggle.component';

describe('NotificationStatusToggleComponent', () => {
  let component: NotificationStatusToggleComponent;
  let fixture: ComponentFixture<NotificationStatusToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationStatusToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationStatusToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
