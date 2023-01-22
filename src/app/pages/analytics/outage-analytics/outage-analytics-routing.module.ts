import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutageAnalyticsExpandedComponent } from './outage-analytics-expanded/outage-analytics-expanded.component';
import { OutageAnalyticsComponent } from './outage-analytics.component';

const routes: Routes = [
  {
    path: '',
    component: OutageAnalyticsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutageAnalyticsRoutingModule { }
