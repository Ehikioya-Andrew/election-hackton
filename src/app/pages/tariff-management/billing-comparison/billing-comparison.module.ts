import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingComparisonRoutingModule } from './billing-comparison-routing.module';
import { BillingComparisonComponent } from './billing-comparison.component';
import { BillingHeaderBlockComponent } from './billing-header-block/billing-header-block.component';
import { BillingHeaderFormComponent } from './billing-header-form/billing-header-form.component';
import {
  NbAlertModule,
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbDatepickerModule,
  NbDialogModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbProgressBarModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTagModule,
  NbThemeModule,
  NbToggleModule,
} from '@nebular/theme';
import { LottieModule } from 'ngx-lottie';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { TablesModule } from 'src/app/@tables/tables.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadFormComponent } from './upload-form/upload-form.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { BillingComfigureFormComponent } from './billing-comfigure-form/billing-comfigure-form.component';
import { BillingStatusToggleComponent } from './billing-status-toggle/billing-status-toggle.component';

@NgModule({
  declarations: [
    BillingHeaderFormComponent,
    BillingComparisonComponent,
    BillingHeaderBlockComponent,
    UploadFormComponent,
    BillingComfigureFormComponent,
    BillingStatusToggleComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
    BillingComparisonRoutingModule,
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
    NbToggleModule,
    NbDatepickerModule,
    NgxDropzoneModule,
    NbProgressBarModule,
    LottieModule,
    NbAlertModule,
    NbTagModule,
  ],
})
export class BillingComparisonModule {}
