import { LoadPointsComponent } from './load-points.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadPointsRoutingModule } from './load-points-routing.module';
import { LottieModule } from 'ngx-lottie';
import { LoadPointFormComponent } from './load-point-form/load-point-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbDialogModule,
  NbCardModule,
  NbIconModule,
  NbAlertModule,
  NbInputModule,
  NbSpinnerModule,
  NbButtonModule,
  NbSelectModule,
  NbFormFieldModule,
  NbThemeModule,
  NbAutocompleteModule,
  NbToggleModule,
  NbTooltipModule,
} from '@nebular/theme';
import { TablesModule } from 'src/app/@tables/tables.module';
import { LoadPointStatusToggleComponent } from './load-point-status-toggle/load-point-status-toggle.component';
import { LoadPointGisComponent } from './load-point-gis/load-point-gis.component';

@NgModule({
  declarations: [
    LoadPointsComponent,
    LoadPointFormComponent,
    LoadPointStatusToggleComponent,
    LoadPointGisComponent,
  ],
  imports: [
    CommonModule,
    LoadPointsRoutingModule,
    TablesModule,
    NbDialogModule,
    NbCardModule,
    NbIconModule,
    NbAlertModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbSpinnerModule,
    NbButtonModule,
    NbSelectModule,
    NbFormFieldModule,
    NbThemeModule,
    NbAutocompleteModule,
    NbThemeModule,
    NbToggleModule,
    LottieModule,
    NbTooltipModule,
  ],
})
export class LoadPointsModule {}
