import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSelectModule, NbDatepickerModule, NbSpinnerModule, NbFormFieldModule, NbAutocompleteModule, NbTimepickerModule } from '@nebular/theme';
import { ChartsModule } from 'src/app/@charts/chart.module';
import { MapsModule } from 'src/app/@maps/maps.module';
import { TablesModule } from 'src/app/@tables/tables.module';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { AnalyticsBlockComponent } from './analytics-block/analytics-block.component';
import { AnalyticsConfigFormComponent } from './analytics-config-form/analytics-config-form.component';
import { LottieModule } from 'ngx-lottie';



@NgModule({
  declarations: [AnalyticsBlockComponent, AnalyticsConfigFormComponent],
  imports: [
    CommonModule,
    ChartsModule,
    ThemeModule,
    MapsModule,
    TablesModule,
    NbSelectModule,
    NbDatepickerModule,
    NbTimepickerModule,
    NbSpinnerModule,
    NbFormFieldModule,
    NbAutocompleteModule,
    LottieModule,
  ],
  exports: [
    AnalyticsBlockComponent, AnalyticsConfigFormComponent
  ]
})
export class AnalyticsSharedModule { }
