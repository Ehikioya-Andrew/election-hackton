import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { LottieModule } from 'ngx-lottie';
import { NbButtonModule, NbLayoutModule } from '@nebular/theme';


@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    LandingRoutingModule,
    LottieModule,
    NbLayoutModule,
    NbButtonModule
  ]
})
export class LandingModule { }
