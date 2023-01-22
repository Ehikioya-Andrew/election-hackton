import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NbAutocompleteModule, NbButtonGroupModule, NbButtonModule, NbCardModule, NbFormFieldModule, NbSpinnerModule } from '@nebular/theme';
import { SortablejsModule } from 'ngx-sortablejs';
import { ChartsModule } from 'src/app/@charts/chart.module';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { TablesModule } from 'src/app/@tables/tables.module';
import { MapsModule } from 'src/app/@maps/maps.module';
import { ChartModule } from 'angular2-chartjs';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NbCardModule,
    SortablejsModule,
    ThemeModule,
    ChartsModule,
    TablesModule,
    NbSpinnerModule,
    MapsModule,
    NbButtonModule,
    NbButtonGroupModule,
    NbFormFieldModule,
    NbAutocompleteModule,
    ChartModule
  ]
})
export class DashboardModule { }
