import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExecutiveSummaryComponent } from './executive-summary.component';

const routes: Routes = [
  {
    path: '',
    component: ExecutiveSummaryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecutiveSummaryRoutingModule {}
