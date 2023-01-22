import { TablesModule } from './../../../@tables/tables.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetersRoutingModule } from './meters-routing.module';
import { MetersComponent } from './meters.component';
import { LottieModule } from 'ngx-lottie';
import { MeterFormComponent } from './meter-form/meter-form.component';
import {
  NbDialogModule,
  NbCardModule,
  NbAlertModule,
  NbIconModule,
  NbInputModule,
  NbSpinnerModule,
  NbButtonModule,
  NbSelectModule,
  NbFormFieldModule,
  NbThemeModule,
  NbAutocompleteModule,
  NbToggleModule,
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MeterStatusToggleComponent } from './meter-status-toggle/meter-status-toggle.component';

@NgModule({
  declarations: [
    MetersComponent,
    MeterFormComponent,
    MeterStatusToggleComponent,
  ],
  imports: [
    CommonModule,
    MetersRoutingModule,
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
export class MetersModule {}
