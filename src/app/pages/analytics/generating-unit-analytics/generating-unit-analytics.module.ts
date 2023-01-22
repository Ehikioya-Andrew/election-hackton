import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneratingUnitAnalyticsRoutingModule } from './generating-unit-analytics-routing.module';
import { GeneratingUnitAnalyticsComponent } from './generating-unit-analytics.component';
import { GeneratingUnitAnalyticsExpandedComponent } from './generating-unit-analytics-expanded/generating-unit-analytics-expanded.component';
import { GeneratingUnitAnalyticsSummaryComponent } from './generating-unit-analytics-summary/generating-unit-analytics-summary.component';
import { ChartsModule } from 'src/app/@charts/chart.module';
import { NbCardModule, NbIconModule, NbSpinnerModule, NbThemeModule, NbTooltipModule } from '@nebular/theme';
import { AnalyticsSharedModule } from '../analytics-shared/analytics-shared.module';
import { TablesModule } from 'src/app/@tables/tables.module';
import { LottieModule } from 'ngx-lottie';
import { ExpandedButtonComponent } from './expanded-button/expanded-button.component';
import { ThemeModule } from 'src/app/@theme/theme.module';


@NgModule({
  declarations: [
    GeneratingUnitAnalyticsComponent, 
    GeneratingUnitAnalyticsExpandedComponent, 
    GeneratingUnitAnalyticsSummaryComponent, ExpandedButtonComponent
  ],
  imports: [
    CommonModule,
    GeneratingUnitAnalyticsRoutingModule,
    ChartsModule,
    NbThemeModule,
    ThemeModule,
    NbCardModule,
    AnalyticsSharedModule,
    TablesModule,
    NbIconModule,
    LottieModule,
    NbTooltipModule,
    NbSpinnerModule
  ]
})
export class GeneratingUnitAnalyticsModule { }
