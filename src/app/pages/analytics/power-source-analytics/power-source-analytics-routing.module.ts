import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PowerSourceAnalyticsExpandedComponent } from './power-source-analytics-expanded/power-source-analytics-expanded.component';
import { PowerSourceAnalyticsSummaryComponent } from './power-source-analytics-summary/power-source-analytics-summary.component';
import { PowerSourceAnalyticsComponent } from './power-source-analytics.component';

const routes: Routes = [
  {
    path: '',
    component: PowerSourceAnalyticsComponent,
    children: [
      {
        path: '',
        redirectTo: 'summary',
        pathMatch: 'prefix',
      },
      {
        path: 'summary',
        component: PowerSourceAnalyticsSummaryComponent,
        data: { isSummary: true },
      },
      {
        path: 'expanded',
        component: PowerSourceAnalyticsExpandedComponent,
        data: { isSummary: false },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PowerSourceAnalyticsRoutingModule {}
