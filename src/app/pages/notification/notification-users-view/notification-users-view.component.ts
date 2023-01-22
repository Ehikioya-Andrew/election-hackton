import { Component, Input } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { lastValueFrom } from 'rxjs';
import { NotificationDto } from 'src/app/@core/dtos/notifications.dto';
import { NotificationUsersListComponent } from '../notification-users-list/notification-users-list.component';

@Component({
  selector: 'app-notification-users-view',
  templateUrl: './notification-users-view.component.html',
  styleUrls: ['./notification-users-view.component.scss'],
})
export class NotificationUsersViewComponent {
  @Input() rowData!: NotificationDto;
  constructor(private dialogService: NbDialogService) {}

  async ViewUsers() {
    const users: any = await lastValueFrom(
      this.dialogService.open(NotificationUsersListComponent, {
        closeOnBackdropClick: false,
        context: { users: this.rowData.recipients },
        closeOnEsc: false,
        hasScroll: true,
      }).onClose
    );
    if (users) {
    }
  }
}
