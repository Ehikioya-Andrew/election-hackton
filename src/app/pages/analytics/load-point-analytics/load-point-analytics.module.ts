import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadPointAnalyticsRoutingModule } from './load-point-analytics-routing.module';
import { LoadPointAnalyticsComponent } from './load-point-analytics.component';
import { AnalyticsSharedModule } from '../analytics-shared/analytics-shared.module';
import { LoadPointAnalyticsSummaryComponent } from './load-point-analytics-summary/load-point-analytics-summary.component';
import { LoadPointAnalyticsExpandedComponent } from './load-point-analytics-expanded/load-point-analytics-expanded.component';
import { ChartsModule } from 'src/app/@charts/chart.module';
import { NbCardModule, NbIconModule, NbSpinnerModule, NbThemeModule } from '@nebular/theme';
import { TablesModule } from 'src/app/@tables/tables.module';
import { LottieModule } from 'ngx-lottie';
import { SummaryExpandButtonComponent } from './shared/summary-expand-button/summary-expand-button.component';
import { ThemeModule } from 'src/app/@theme/theme.module';


@NgModule({
  declarations: [
    LoadPointAnalyticsComponent,
    LoadPointAnalyticsSummaryComponent,
    LoadPointAnalyticsExpandedComponent,
    SummaryExpandButtonComponent
  ],
  imports: [
    CommonModule,
    ChartsModule,
    NbThemeModule,
    NbCardModule,
    LoadPointAnalyticsRoutingModule,
    AnalyticsSharedModule,
    TablesModule,
    NbIconModule,
    LottieModule,
    ThemeModule,
    NbSpinnerModule
  ]
})
export class LoadPointAnalyticsModule { }
