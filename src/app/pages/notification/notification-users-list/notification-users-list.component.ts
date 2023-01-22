import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Recipient } from 'src/app/@core/dtos/post-notification.dto';

@Component({
  selector: 'app-notification-users-list',
  templateUrl: './notification-users-list.component.html',
  styleUrls: ['./notification-users-list.component.scss']
})
export class NotificationUsersListComponent {

  @Input() users:Recipient[] = [];
  columns = {
    name: {
      title: 'Full Name',
    },
    email: {
      title: 'Email',
    },
    phone: {
      title: 'Phone Nos',
    },
  }
  constructor( public dialogRef: NbDialogRef<NotificationUsersListComponent>,) { }

  close(): void {
    this.dialogRef.close(false);
  }
}
