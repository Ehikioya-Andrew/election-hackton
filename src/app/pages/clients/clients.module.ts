import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablesModule } from 'src/app/@tables/tables.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { NbDialogModule, NbButtonModule, NbCardModule, NbIconModule, NbAlertModule, NbInputModule, NbFormFieldModule, NbSpinnerModule, NbStepperModule } from '@nebular/theme';
import { NbSecurityModule } from '@nebular/security';


@NgModule({
  declarations: [
    ClientsComponent,
    ClientFormComponent,
    
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    NbDialogModule,
    TablesModule,
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbAlertModule,
    FormsModule,
    ReactiveFormsModule,
    NbFormFieldModule,
    NbInputModule,
    NbSpinnerModule,
    NbStepperModule,
    NbSecurityModule.forRoot(),
  ]
})
export class ClientsModule { }
