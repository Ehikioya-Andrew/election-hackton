import { TablesModule } from './../../../@tables/tables.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceBandRoutingModule } from './service-band-routing.module';
import { ServiceBandComponent } from './service-band.component';
import { ServiceBandFormComponent } from './service-band-form/service-band-form.component';
import { ServiceBandStatusToggleComponent } from './service-band-status-toggle/service-band-status-toggle.component';
import { NbDialogModule, NbCardModule, NbIconModule, NbAlertModule, NbInputModule, NbSpinnerModule, NbButtonModule, NbSelectModule, NbFormFieldModule, NbThemeModule, NbAutocompleteModule, NbToggleModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ServiceBandComponent,
    ServiceBandFormComponent,
    ServiceBandStatusToggleComponent
  ],
  imports: [
    CommonModule,
    ServiceBandRoutingModule,
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
    NbToggleModule,
  ]
})
export class ServiceBandModule { }
