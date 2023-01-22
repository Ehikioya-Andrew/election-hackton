import { ThemeModule } from './../../../@theme/theme.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StreetlightDashboardRoutingModule } from './streetlight-dashboard-routing.module';
import { StreetlightDashboardComponent } from './streetlight-dashboard.component';


@NgModule({
  declarations: [
    StreetlightDashboardComponent
  ],
  imports: [
    CommonModule,
    StreetlightDashboardRoutingModule,
    ThemeModule
  ]
})
export class StreetlightDashboardModule { }
