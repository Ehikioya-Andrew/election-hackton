import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsSharedModule } from '../analytics-shared/analytics-shared.module';
import { ChartsModule } from 'src/app/@charts/chart.module';
import { NbAutocompleteModule, NbCardModule, NbDatepickerModule, NbFormFieldModule, NbIconModule, NbListModule, NbSpinnerModule, NbThemeModule } from '@nebular/theme';
import { TablesModule } from 'src/app/@tables/tables.module';
import { LottieModule } from 'ngx-lottie';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { OutageAnalyticsComponent } from './outage-analytics.component';
import { OutageAnalyticsRoutingModule } from './outage-analytics-routing.module';
import { OutageBlockComponent } from './outage-block/outage-block.component';
import { OutageConfigFormComponent } from './outage-config-form/outage-config-form.component';


@NgModule({
  declarations: [
    OutageAnalyticsComponent,
    OutageBlockComponent,
    OutageConfigFormComponent,
  ],
  imports: [
    CommonModule,
    ChartsModule,
    NbThemeModule,
    NbCardModule,
    OutageAnalyticsRoutingModule,
    AnalyticsSharedModule,
    TablesModule,
    NbIconModule,
    LottieModule,
    ThemeModule,
    NbFormFieldModule,
    NbAutocompleteModule,
    NbListModule,
    NbDatepickerModule,
    NbSpinnerModule,

  ]
})
export class OutageAnalyticsModule { }
