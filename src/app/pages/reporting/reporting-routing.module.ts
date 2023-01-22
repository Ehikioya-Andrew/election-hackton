import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneratingSetReportingComponent } from './generating-set-reporting/generating-set-reporting.component';
import { LoadPointReportingComponent } from './load-point-reporting/load-point-reporting.component';
import { PowerSourceReportingComponent } from './power-source-reporting/power-source-reporting.component';
import { ReportingComponent } from './reporting.component';

const routes: Routes = [
  {
    path: '',
    component: ReportingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }
