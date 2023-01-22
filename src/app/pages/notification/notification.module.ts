import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { LottieModule } from 'ngx-lottie';
import { NotificationComponent } from './notification.component';
import { NotificationFormComponent } from './notification-form/notification-form.component';
import {
  NbAlertModule,
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbDatepickerModule,
  NbDialogModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTagModule,
  NbTimepickerModule,
} from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { TablesModule } from 'src/app/@tables/tables.module';
import { NotificationStatusToggleComponent } from './notification-status-toggle/notification-status-toggle.component';
import { NotificationUsersViewComponent } from './notification-users-view/notification-users-view.component';
import { NotificationUsersListComponent } from './notification-users-list/notification-users-list.component';

@NgModule({
  declarations: [
    NotificationComponent,
    NotificationFormComponent,
    NotificationStatusToggleComponent,
    NotificationUsersViewComponent,
    NotificationUsersListComponent,
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    NbButtonModule,
    NbDialogModule,
    NbInputModule,
    NbCardModule,
    ReactiveFormsModule,
    NbFormFieldModule,
    NbSpinnerModule,
    NbIconModule,
    NbAlertModule,
    NbSelectModule,
    ThemeModule,
    TablesModule,
    NbAutocompleteModule,
    NbTagModule,
    LottieModule,
    NbDatepickerModule,
    NbTimepickerModule,
  ],
})
export class NotificationModule {}
