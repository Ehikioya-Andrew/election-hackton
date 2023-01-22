import { ThemeModule } from './../../../@theme/theme.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneratingSetDashboardRoutingModule } from './generating-set-dashboard-routing.module';
import { GeneratingSetDashboardComponent } from './generating-set-dashboard.component';


@NgModule({
  declarations: [
    GeneratingSetDashboardComponent
  ],
  imports: [
    CommonModule,
    GeneratingSetDashboardRoutingModule,
    ThemeModule
  ]
})
export class GeneratingSetDashboardModule { }
