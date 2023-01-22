import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NbAuthModule } from '@nebular/auth';

import { AuthRoutingModule } from './auth-routing.module';

import {
  NbAlertModule,
  NbInputModule,
  NbButtonModule,
  NbCheckboxModule,
  NbIconModule,
  NbSpinnerModule,
  NbFormFieldModule
} from '@nebular/theme';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RequestPasswordComponent } from './request-password/request-password.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';


@NgModule({
  declarations: [LoginComponent, ResetPasswordComponent, RequestPasswordComponent, UpdatePasswordComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbAuthModule,
    NbSpinnerModule,
    NbFormFieldModule,
    NbIconModule,
    NbEvaIconsModule
  ]
})
export class AuthModule { }
