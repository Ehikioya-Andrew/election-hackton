import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OccResources, OccResourcesNavMap } from './occ-resources';
import { OccComponent } from './occ.component';

const routes: Routes = [
  {
    path: '',
    component: OccComponent,
    children: [
      {
        path: '',
        redirectTo: OccResourcesNavMap.get(OccResources.AssetSummaryView)?.path,
        pathMatch: 'prefix',
      },
      {
        path: OccResourcesNavMap.get(OccResources.AssetSummaryView)?.path,
        loadChildren: () =>
          import('../occ/asset-summary/asset-summary.module').then(
            (m) => m.AssetSummaryModule
          ),
      },
      {
        path: OccResourcesNavMap.get(OccResources.GeneratingSetDashboardtView)
          ?.path,
        loadChildren: () =>
          import(
            '../occ/generating-set-dashboard/generating-set-dashboard.module'
          ).then((m) => m.GeneratingSetDashboardModule),
      },
      {
        path: OccResourcesNavMap.get(OccResources.GridAnalyticsDashboardView)
          ?.path,
        loadChildren: () =>
          import(
            '../occ/grid-analytics-dashboard/grid-analytics-dashboard.module'
          ).then((m) => m.GridAnalyticsDashboardModule),
      },
      {
        path: OccResourcesNavMap.get(OccResources.LoadPointDashboardView)?.path,
        loadChildren: () =>
          import(
            '../occ/load-point-dashboard/load-point-dashboard.module'
          ).then((m) => m.LoadPointDashboardModule),
      },
      {
        path: OccResourcesNavMap.get(OccResources.PowerStationDashboardView)
          ?.path,
        loadChildren: () =>
          import(
            '../occ/power-station-dashboard/power-station-dashboard.module'
          ).then((m) => m.PowerStationDashboardModule),
      },
      {
        path: OccResourcesNavMap.get(OccResources.StreetlightDashboardView)
          ?.path,
        loadChildren: () =>
          import(
            '../occ/streetlight-dashboard/streetlight-dashboard.module'
          ).then((m) => m.StreetlightDashboardModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OccRoutingModule {}
