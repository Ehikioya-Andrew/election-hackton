import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StreetLightRoutingModule } from './street-light-routing.module';
import { StreetLightComponent } from './street-light.component';
import { MapsModule } from 'src/app/@maps/maps.module';
import { NbAutocompleteModule, NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbListModule, NbSpinnerModule, NbTagModule } from '@nebular/theme';
import { TablesModule } from 'src/app/@tables/tables.module';
import { StreetLightMarkerInfoComponent } from './street-light-marker-info/street-light-marker-info';
import { LottieModule } from 'ngx-lottie';
import { StreetLightStatusComponent } from './street-light-marker-info/street-light-status/street-light-status.component';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { SortablejsModule } from 'ngx-sortablejs';


@NgModule({
  declarations: [
    StreetLightComponent,
    StreetLightMarkerInfoComponent,
    StreetLightStatusComponent
  ],
  imports: [
    CommonModule,
    StreetLightRoutingModule,
    MapsModule,
    NbCardModule,
    TablesModule,
    NbIconModule,
    NbListModule,
    NbButtonModule,
    NbSpinnerModule,
    LottieModule,
    NbTagModule,
    NbFormFieldModule,
    NbAutocompleteModule,
    SortablejsModule,
    ThemeModule,
  ]
})
export class StreetLightModule { }
