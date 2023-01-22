import { ThemeModule } from './../../../@theme/theme.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridAnalyticsDashboardRoutingModule } from './grid-analytics-dashboard-routing.module';
import { GridAnalyticsDashboardComponent } from './grid-analytics-dashboard.component';
import { GridAnalyticsModule } from '../../grid-analytics/grid-analytics.module';


@NgModule({
  declarations: [
    GridAnalyticsDashboardComponent
  ],
  imports: [
    CommonModule,
    GridAnalyticsDashboardRoutingModule,
    ThemeModule,
    GridAnalyticsModule
  ]
})
export class GridAnalyticsDashboardModule { }
