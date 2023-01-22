import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridAnalyticsRoutingModule } from './grid-analytics-routing.module';
import { GridAnalyticsComponent } from './grid-analytics.component';
import { NbCardModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { LottieModule } from 'ngx-lottie';
import { ThemeModule } from 'src/app/@theme/theme.module';


@NgModule({
  declarations: [
    GridAnalyticsComponent
  ],
  imports: [
    CommonModule,
    GridAnalyticsRoutingModule,
    NbCardModule,
    NbSpinnerModule,
    NbSelectModule,
    LottieModule,
    ThemeModule,
  ],
  exports: [GridAnalyticsComponent]
})
export class GridAnalyticsModule { }
