import { NgModule } from '@angular/core';

import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbTooltipModule,
  NbCardModule,
  NbAlertModule,
  NbTabsetModule,
  NbListModule,
  NbToggleModule,
  NbInputModule,
  NbAutocompleteModule,
  NbFormFieldModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbSecurityModule } from '@nebular/security';

import { FooterComponent, HeaderComponent } from './components';
import {
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
} from './pipes';
import {
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
} from './layouts';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { SettingsComponent } from './components/settings/settings.component';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SlideOutComponent } from './components/slide-out/slide-out.component';
import { NotFoundSvgComponent } from './components/not-found-svg/not-found-svg.component';
import { ItemCardComponent } from './components/item-card/item-card.component';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table/lib/ng2-smart-table.module';

const NB_MODULES = [
  RouterModule,
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
  NbTooltipModule,
  NbCardModule,
  NbAlertModule,
  NbTabsetModule,
  NbListModule,
  NbToggleModule,
  Ng2SmartTableModule,
  ReactiveFormsModule,
  NbInputModule,
  NbAutocompleteModule,
  NbFormFieldModule,
];
const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
  ConfirmationDialogComponent,
  SettingsComponent,
  SlideOutComponent,
  NotFoundSvgComponent,
  ItemCardComponent,
];
const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
];

@NgModule({
  imports: [CommonModule, ...NB_MODULES],
  exports: [CommonModule, ...PIPES, ...COMPONENTS, ...NB_MODULES],
  declarations: [...COMPONENTS, ...PIPES],
})
export class ThemeModule {}
