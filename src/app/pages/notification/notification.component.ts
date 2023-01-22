import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AnimationOptions } from 'ngx-lottie';
import { forkJoin, lastValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/@core/data-services/notification.service';
import { NotificationCategoryDto } from 'src/app/@core/dtos/notification-category.dto';
import { NotificationDto } from 'src/app/@core/dtos/notifications.dto';
import { PermissionEnum } from 'src/app/@core/enums/permission.enum';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { SeoService } from 'src/app/@core/utils';
import { PermissionService } from 'src/app/@core/utils/permission.service';
import { NotificationFormComponent } from './notification-form/notification-form.component';
import { NotificationResources } from './notification-resources';
import { NotificationStatusToggleComponent } from './notification-status-toggle/notification-status-toggle.component';
import { NotificationUsersViewComponent } from './notification-users-view/notification-users-view.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  isLoadingData = true;
  notificationResources = NotificationResources;
  notifications: NotificationDto[] = [];
  notificationTypeName: NotificationCategoryDto[] = [];
  columns = {
    notificationTypeString: {
      title: 'Type',
    },
    assetTypeString: {
      title: 'Asset',
    },
    location: {
      title: 'Location',
    },
    recurrenceIntervalString: {
      title: 'Frequency',
      valuePrepareFunction: (x: string) =>
        x ? this.formatFrequency(x) : 'N/A',
    },
    nextNotificationTime: {
      title: 'Date',
    },
    isActive: {
      title: 'Status',
      renderComponent: NotificationStatusToggleComponent,
      type: 'custom',
      filter: {
        type: 'list',
        config: {
          selectText: 'Select...',
          list: [
            { value: true, title: 'Active' },
            { value: false, title: 'Inactive' },
          ],
        },
      },
      filterFunction: (x: boolean, y: boolean) => x.toString() === y.toString(),
    },

    users: {
      title: 'Users',
      renderComponent: NotificationUsersViewComponent,
      type: 'custom',
      filter: false,
      hide: !this.permissionService.canAccessByResource(
        PermissionEnum.View,
        NotificationResources.ViewClientColumn
      ),
    },
  };
  options: AnimationOptions = {
    path: '/assets/animations/36499-page-not-found.json',
  };
  constructor(
    public permissionService: PermissionService,
    private dialogService: NbDialogService,
    private seo: SeoService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.seo.setSeoData(
      'Notifications - [Notification Configuration]',
      'Manage notification configuration'
    );
    this.requestData();
  }

  formatFrequency(value: string) {
    switch (value) {
      case 'Hour':
        return 'Hourly';
        break;
      case 'Day':
        return 'Daily';
        break;
      case 'Week':
        return 'Weekly';
        break;
      case 'Month':
        return 'Monthly';
        break;
      default:
        return 'N/A';
        break;
    }
  }
  async createNotification() {
    const notifications = await lastValueFrom(
      this.dialogService.open(NotificationFormComponent, {
        closeOnBackdropClick: false,
        context: {
          isCreateRequest: true,
          categoryData: this.notificationTypeName,
        },
        closeOnEsc: false,
        hasScroll: true,
      }).onClose
    );
    if (notifications) {
      this.requestData();
    }
  }

  async updateNotification({ data }: { data: any }) {
    const notifications = await lastValueFrom(
      this.dialogService.open(NotificationFormComponent, {
        closeOnBackdropClick: false,
        context: {
          isCreateRequest: false,
          NotificationFormUpdate: data,
          categoryData: this.notificationTypeName,
        },
        closeOnEsc: false,
        hasScroll: true,
      }).onClose
    );
    if (notifications) {
      this.requestData();
    }
  }
  requestData(data?: any) {
    this.isLoadingData = true;
    let notifications = this.notificationService.getNotifications(data);
    let categoryData = this.notificationService.getNotificationCategory(data);

    forkJoin([notifications, categoryData]).subscribe(
      (response) => {
        this.isLoadingData = false;
        this.notifications = GetUniqueArray(
          [...(response[0].data?.itemList ?? [])],
          [...this.notifications]
        );
        this.notificationTypeName = GetUniqueArray(
          [...(response[1].data ?? [])],
          [...this.notificationTypeName]
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
