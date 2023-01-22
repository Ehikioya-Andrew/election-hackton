import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneratingUnitAnalyticsExpandedComponent } from './generating-unit-analytics-expanded/generating-unit-analytics-expanded.component';
import { GeneratingUnitAnalyticsSummaryComponent } from './generating-unit-analytics-summary/generating-unit-analytics-summary.component';
import { GeneratingUnitAnalyticsComponent } from './generating-unit-analytics.component';

const routes: Routes = [
  {
    path: '',
    component: GeneratingUnitAnalyticsComponent,
    children: [
      {
        path: '',
        redirectTo: 'summary',
        pathMatch: 'prefix',
      },
      {
        path: 'summary',
        component: GeneratingUnitAnalyticsSummaryComponent,
        data: { isSummary: true },
      },
      {
        path: 'expanded',
        component: GeneratingUnitAnalyticsExpandedComponent,
        data: { isSummary: false },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneratingUnitAnalyticsRoutingModule {}
