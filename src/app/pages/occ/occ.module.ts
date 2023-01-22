import { ThemeModule } from 'src/app/@theme/theme.module';
import { NbCardModule } from '@nebular/theme';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OccRoutingModule } from './occ-routing.module';
import { OccComponent } from './occ.component';


@NgModule({
  declarations: [
    OccComponent
  ],
  imports: [
    CommonModule,
    OccRoutingModule,
    NbCardModule,
    ThemeModule
  ]
})
export class OccModule { }
