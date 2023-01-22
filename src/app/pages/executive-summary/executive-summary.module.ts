import { LottieModule } from 'ngx-lottie';
import { TablesModule } from 'src/app/@tables/tables.module';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from 'src/app/@theme/theme.module';
import {
  NbCardModule,
  NbDatepickerModule,
  NbTimepickerModule,
  NbAutocompleteModule,
  NbFormFieldModule,
  NbIconModule,
} from '@nebular/theme';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExecutiveSummaryRoutingModule } from './executive-summary-routing.module';
import { ExecutiveSummaryComponent } from './executive-summary.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ExecutiveSummaryConfigComponent } from './executive-summary-config/executive-summary-config.component';
import { ExecutiveSummaryGenSetExpandButtonComponent } from './executive-summary-gen-set-expand-button/executive-summary-gen-set-expand-button.component';
import { ExecutiveSummaryLoadpointExpandButtonComponent } from './executive-summary-loadpoint-expand-button/executive-summary-loadpoint-expand-button.component';
import { ExecutiveSummaryDialogComponent } from './executive-summary-dialog/executive-summary-dialog.component';

@NgModule({
  declarations: [
    ExecutiveSummaryComponent,
    ExecutiveSummaryConfigComponent,
    ExecutiveSummaryDialogComponent,
    ExecutiveSummaryGenSetExpandButtonComponent,
    ExecutiveSummaryLoadpointExpandButtonComponent,
  ],
  bootstrap: [ExecutiveSummaryComponent],
  imports: [
    CommonModule,
    ExecutiveSummaryRoutingModule,
    HttpClientModule,
    NbCardModule,
    ThemeModule,
    NbDatepickerModule,
    FormsModule,
    NbTimepickerModule,
    NbAutocompleteModule,
    NbFormFieldModule,
    TablesModule,
    NbIconModule,
    LottieModule
  ],
})
export class ExecutiveSummaryModule {}
