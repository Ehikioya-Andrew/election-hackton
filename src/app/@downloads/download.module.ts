import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadComponent } from './download.component';
import { DownloadDialogComponent } from './download-dialog/download-dialog.component';
import { NbContextMenuModule, NbIconModule, NbMenuModule, NbSpinnerModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';



@NgModule({
  declarations: [
    DownloadComponent
  ],
  imports: [
    CommonModule,
    NbContextMenuModule,
    NbMenuModule,
    NbIconModule,
    ThemeModule,
    NbSpinnerModule
  ],
  exports: [
    DownloadComponent,
  ]
})
export class DownloadModule { }
