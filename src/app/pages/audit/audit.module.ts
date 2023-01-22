import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuditRoutingModule } from './audit-routing.module';
import { AuditComponent } from './audit.component';
import { AuditConfigFormComponent } from './audit-config-form/audit-config-form.component';
import { NbAutocompleteModule, NbCardModule, NbDatepickerModule, NbFormFieldModule, NbIconModule, NbListModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { LottieModule } from 'ngx-lottie';
import { TablesModule } from 'src/app/@tables/tables.module';
import { AuditBlockComponent } from './audit-block/audit-block.component';
import { DownloadModule } from 'src/app/@downloads/download.module';


@NgModule({
  declarations: [
    AuditComponent,
    AuditConfigFormComponent,
    AuditBlockComponent
  ],
  imports: [
    CommonModule,
    AuditRoutingModule,
    NbCardModule,
    NbIconModule,
    NbIconModule,
    ThemeModule,
    LottieModule,
    TablesModule,
    NbDatepickerModule,
    NbSpinnerModule,
    NbFormFieldModule,
    NbAutocompleteModule,
    NbListModule,
    DownloadModule
  ]
})
export class AuditModule { }
