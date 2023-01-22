import { TablesModule } from 'src/app/@tables/tables.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneratingSetRoutingModule } from './generating-set-routing.module';
import { GeneratingSetComponent } from './generating-set.component';
import { LottieModule } from 'ngx-lottie';
import { GeneratingSetFormComponent } from './generating-set-form/generating-set-form.component';
import { GeneratingSetStatusToggleComponent } from './generating-set-status-toggle/generating-set-status-toggle.component';
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
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneratingSetGisComponent } from './generating-set-gis/generating-set-gis.component';

@NgModule({
  declarations: [
    GeneratingSetComponent,
    GeneratingSetFormComponent,
    GeneratingSetStatusToggleComponent,
    GeneratingSetGisComponent,
  ],
  imports: [
    CommonModule,
    GeneratingSetRoutingModule,
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
export class GeneratingSetModule {}
