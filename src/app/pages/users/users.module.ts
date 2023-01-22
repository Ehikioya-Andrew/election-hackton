import { ReactiveFormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbDialogModule,
  NbInputModule,
  NbCardModule,
  NbFormFieldModule,
  NbSpinnerModule,
  NbIconModule,
  NbAlertModule,
  NbSelectModule,
  NbAutocompleteModule,
} from '@nebular/theme';
import { LottieModule } from 'ngx-lottie';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UserFormComponent } from './user-form/user-form.component';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { TablesModule } from 'src/app/@tables/tables.module';
import { UserStatusToggleComponent } from './user-table-components/user-status-toggle/user-status-toggle.component';
import { UserStatusFilterComponent } from './user-table-components/user-status-filter/user-status-filter.component';

@NgModule({
  declarations: [UsersComponent, UserFormComponent, UserStatusToggleComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
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
    LottieModule,
    NbAutocompleteModule,
  ],
})
export class UsersModule {}
