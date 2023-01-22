import { ThemeModule } from './../../../@theme/theme.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadPointDashboardRoutingModule } from './load-point-dashboard-routing.module';
import { LoadPointDashboardComponent } from './load-point-dashboard.component';


@NgModule({
  declarations: [
    LoadPointDashboardComponent
  ],
  imports: [
    CommonModule,
    LoadPointDashboardRoutingModule,
    ThemeModule

  ]
})
export class LoadPointDashboardModule { }
