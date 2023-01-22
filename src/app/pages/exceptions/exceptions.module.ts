import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExceptionsRoutingModule } from './exceptions-routing.module';
import { UnauthorisedComponent } from './unauthorised/unauthorised.component';
import { UserIdleComponent } from './user-idle/user-idle.component';
import { InvalidDeviceComponent } from './invalid-device/invalid-device.component';
import { NbLayoutModule, NbButtonModule, NbIconModule, NbCardModule } from '@nebular/theme';
import { LottieModule } from 'ngx-lottie';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ExceptionsComponent } from './exceptions.component';
import { ExceptionBlockComponent } from './exception-block/exception-block.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';


@NgModule({
  declarations: [UnauthorisedComponent, UserIdleComponent, InvalidDeviceComponent, PageNotFoundComponent, ExceptionsComponent, ExceptionBlockComponent],
  imports: [
    CommonModule,
    ExceptionsRoutingModule,
    NbLayoutModule,
    NbButtonModule,
    NbIconModule,
    NbEvaIconsModule,
    LottieModule,
    NbCardModule
  ]
})
export class ExceptionsModule { }
