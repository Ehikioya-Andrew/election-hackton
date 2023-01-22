import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PowerSourceAnalyticsRoutingModule } from './power-source-analytics-routing.module';
import { PowerSourceAnalyticsComponent } from './power-source-analytics.component';
import { PowerSourceAnalyticsExpandedComponent } from './power-source-analytics-expanded/power-source-analytics-expanded.component';
import { PowerSourceAnalyticsSummaryComponent } from './power-source-analytics-summary/power-source-analytics-summary.component';
import { LottieModule } from 'ngx-lottie';
import { NbCardModule, NbIconModule, NbSpinnerModule, NbThemeModule, NbTooltipModule, NbTreeGridModule } from '@nebular/theme';
import { TablesModule } from 'src/app/@tables/tables.module';
import { AnalyticsSharedModule } from '../analytics-shared/analytics-shared.module';
import { ChartsModule } from 'src/app/@charts/chart.module';
import { ExpandedButtonComponent } from './expanded-button/expanded-button.component';
import { ThemeModule } from 'src/app/@theme/theme.module';


@NgModule({
  declarations: [
    PowerSourceAnalyticsComponent,
    PowerSourceAnalyticsExpandedComponent,
    PowerSourceAnalyticsSummaryComponent,
    ExpandedButtonComponent
  ],
  imports: [
    CommonModule,
    PowerSourceAnalyticsRoutingModule,
    ChartsModule,
    NbThemeModule,
    ThemeModule,
    NbCardModule,
    AnalyticsSharedModule,
    TablesModule,
    NbIconModule,
    LottieModule,
    NbTooltipModule,
    NbTreeGridModule,
    NbSpinnerModule
  ]
})
export class PowerSourceAnalyticsModule { }
