import { TablesModule } from './../../../@tables/tables.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TariffRoutingModule } from './tariff-routing.module';
import { TariffComponent } from './tariff.component';
import { LottieModule } from 'ngx-lottie';
import { TariffFormComponent } from './tariff-form/tariff-form.component';
import { TariffStatusToggleComponent } from './tariff-status-toggle/tariff-status-toggle.component';
import {
  NbDialogModule,
  NbCardModule,
  NbIconModule,
  NbAlertModule,
  NbSpinnerModule,
  NbInputModule,
  NbButtonModule,
  NbSelectModule,
  NbFormFieldModule,
  NbThemeModule,
  NbAutocompleteModule,
  NbToggleModule,
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TariffComponent,
    TariffFormComponent,
    TariffStatusToggleComponent,
  ],
  imports: [
    CommonModule,
    TariffRoutingModule,
    CommonModule,
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
    LottieModule,
    NbToggleModule,
  ],
})
export class TariffModule {}
