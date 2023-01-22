import { ThemeModule } from './../../../@theme/theme.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PowerStationDashboardRoutingModule } from './power-station-dashboard-routing.module';
import { PowerStationDashboardComponent } from './power-station-dashboard.component';


@NgModule({
  declarations: [
    PowerStationDashboardComponent
  ],
  imports: [
    CommonModule,
    PowerStationDashboardRoutingModule,
    ThemeModule
  ]
})
export class PowerStationDashboardModule { }
