import { LottieModule } from 'ngx-lottie';
import { ChartsModule } from './../../../@charts/chart.module';
import { ChartModule } from 'angular2-chartjs';
import { MapsModule } from './../../../@maps/maps.module';
import { ThemeModule } from './../../../@theme/theme.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetSummaryRoutingModule } from './asset-summary-routing.module';
import { AssetSummaryComponent } from './asset-summary.component';
import { NbSpinnerModule } from '@nebular/theme';


@NgModule({
  declarations: [
    AssetSummaryComponent
  ],
  imports: [
    CommonModule,
    AssetSummaryRoutingModule,
    ThemeModule,
    MapsModule,
    NbSpinnerModule,
    ChartModule,
    ChartsModule,
    LottieModule
  ]
})
export class AssetSummaryModule { }
