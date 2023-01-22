import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingComponent } from './reporting.component';
import { ReportingBlockComponent } from './reporting-block/reporting-block.component';
import { ReportingConfigFormComponent } from './reporting-config-form/reporting-config-form.component';
import { NbAutocompleteModule, NbCardModule, NbDatepickerModule, NbFormFieldModule, NbIconModule, NbListModule, NbSelectModule, NbSpinnerModule, NbTimepickerModule } from '@nebular/theme';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { LottieModule } from 'ngx-lottie';
import { MapsModule } from 'src/app/@maps/maps.module';
import { TablesModule } from 'src/app/@tables/tables.module';
import { DownloadModule } from 'src/app/@downloads/download.module';
import { LoadPointReportingComponent } from './load-point-reporting/load-point-reporting.component';
import { PowerSourceReportingComponent } from './power-source-reporting/power-source-reporting.component';
import { GeneratingUnitReportingComponent } from './generating-unit-reporting/generating-unit-reporting.component';


@NgModule({
  declarations: [
    ReportingComponent,
    ReportingBlockComponent,
    ReportingConfigFormComponent,
    LoadPointReportingComponent,
    PowerSourceReportingComponent,
    GeneratingUnitReportingComponent,
  ],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    NbCardModule,
    NbIconModule,
    ThemeModule,
    LottieModule,
    MapsModule,
    TablesModule,
    NbSelectModule,
    NbDatepickerModule,
    NbSpinnerModule,
    NbFormFieldModule,
    NbAutocompleteModule,
    NbListModule,
    DownloadModule,
    NbTimepickerModule
  ]
})
export class ReportingModule { }
