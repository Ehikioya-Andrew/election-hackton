import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NbAccessChecker } from '@nebular/security';
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbToastrService,
} from '@nebular/theme';
import { lastValueFrom, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/@core/data-services/notification.service';
import { NotificationDto } from 'src/app/@core/dtos/notifications.dto';
import { OnlineStatService } from 'src/app/@core/utils/online-stat.service';
import { ConfirmationDialogComponent } from 'src/app/@theme/components/confirmation-dialog/confirmation-dialog.component';
import { NotificationResources } from '../notification-resources';

@Component({
  selector: 'app-notification-status-toggle',
  templateUrl: './notification-status-toggle.component.html',
  styleUrls: ['./notification-status-toggle.component.scss'],
})
export class NotificationStatusToggleComponent implements OnInit {
  checked = true;
  isSubmitted = false;

  @Input() value!: string | number;
  @Input() rowData!: NotificationDto;

  notificationResources = NotificationResources;
  canDisableRow = false;

  constructor(
    private dialogService: NbDialogService,
    public notificationService: NotificationService,
    public onlineStat: OnlineStatService,
    private cd: ChangeDetectorRef,
    private toastr: NbToastrService,
    public accessChecker: NbAccessChecker
  ) {}

  ngOnInit(): void {
    this.checked = this.value ? true : false;
    this.canDisableRow = this.rowData.canDisable;
  }

  async onStatusChange(state: boolean) {
    this.isSubmitted = true;
    this.cd.detectChanges();
    const confirmed = await lastValueFrom(
      this.dialogService.open(ConfirmationDialogComponent, {
        context: {
          context: `Are you sure you wish to proceed?`,
          title: `${state ? 'Enable' : 'Disable'} Notification`,
        },
      }).onClose
    );

    if (confirmed) {
      of(state)
        .pipe(
          switchMap((state) => {
            if (state) {
              return this.notificationService.enableNotificationEntry(
                this.rowData.id
              );
            }
            return this.notificationService.disableNotificationEntry(
              this.rowData.id
            );
          })
        )
        .subscribe(
          (response) => {
            if (response.status) {
              this.toastr.success(
                'Status update successful',
                'Notification Update',
                { position: NbGlobalPhysicalPosition.BOTTOM_RIGHT }
              );
              this.isSubmitted = false;
              this.checked = state;
              this.cd.detectChanges();
            } else {
              this.errorResponse(state, true, response.message);
            }
          },
          (error) => {
            this.errorResponse(state);
          }
        );
    } else {
      this.errorResponse(state, false);
    }
  }

  errorResponse(state: boolean, showToaster = true, message?: string) {
    this.isSubmitted = false;
    this.checked = !state;
    this.cd.detectChanges();
    if (showToaster) {
      this.toastr.danger(
        `${message ? message : 'An error occured during execution'}`,
        'Notification Update',
        { position: NbGlobalPhysicalPosition.BOTTOM_RIGHT, duration: 3000 }
      );
    }
  }
}
