import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  HttpClientJsonpModule,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  NbDatepickerModule,
  NbDialogModule,
  NbLayoutDirection,
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule,
  NbTimepickerModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { CoreModule } from './@core/core.module';
import { DEFAULT_THEME } from './@theme/styles/theme.default';
import { DARK_THEME } from './@theme/styles/theme.dark';
import { LocalStorageKey } from './@core/enums/local-storage-key.enum';
import * as SecureLS from 'secure-ls';
import { NetworkInterceptor } from './@core/interceptors/network.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const ls = new SecureLS({ encodingType: 'aes' });

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Angular Modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    // Nebular Modules
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDialogModule.forRoot(),
    NbSidebarModule.forRoot(),
    // Theming
    NbThemeModule.forRoot(
      {
        name:
          ls.get(LocalStorageKey.THEME.toString()) ||
          (window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'default'),
      },
      [DEFAULT_THEME, DARK_THEME],
      undefined,
      NbLayoutDirection.LTR
    ),
    // Global Imports
    CoreModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbTimepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: NetworkInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
