import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingComparisonComponent } from './billing-comparison.component';

const routes: Routes = [
  {
    path: '',
    component: BillingComparisonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingComparisonRoutingModule { }
