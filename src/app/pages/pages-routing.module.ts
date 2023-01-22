import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetTypeEnum } from '../@core/enums/asset-type.enum';
import { HasPermissionGuard } from '../@core/guards/has-permission.guard';
import { PagesResources, PagesResourcesNavMap } from './pages-resources';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivateChild: [HasPermissionGuard],
    children: [
      {
        path: '',
        redirectTo: PagesResourcesNavMap.get(PagesResources.DashboardView)
          ?.path,
        pathMatch: 'prefix',
      },
      {
        path: PagesResourcesNavMap.get(PagesResources.DashboardView)?.path,
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: PagesResourcesNavMap.get(PagesResources.StreetlightView)?.path,
        loadChildren: () =>
          import('./street-light/street-light.module').then(
            (m) => m.StreetLightModule
          ),
      },
      {
        path: PagesResourcesNavMap.get(PagesResources.UsersView)?.path,
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
      },
      {
        path: PagesResourcesNavMap.get(PagesResources.ClientsView)?.path,
        loadChildren: () =>
          import('./clients/clients.module').then((m) => m.ClientsModule),
      },
      {
        path: PagesResourcesNavMap.get(PagesResources.AssetsView)?.path,
        children: [
          {
            path: '',
            redirectTo: PagesResourcesNavMap.get(PagesResources.MetersView)
              ?.path,
            pathMatch: 'prefix',
          },
          {
            path: PagesResourcesNavMap.get(PagesResources.MetersView)?.path,
            loadChildren: () =>
              import('./assets/meters/meters.module').then(
                (m) => m.MetersModule
              ),
          },
          {
            path: PagesResourcesNavMap.get(PagesResources.LoadPointsView)?.path,
            loadChildren: () =>
              import('./assets/load-points/load-points.module').then(
                (m) => m.LoadPointsModule
              ),
          },
          {
            path: PagesResourcesNavMap.get(PagesResources.PowerStationsView)
              ?.path,
            loadChildren: () =>
              import('./assets/power-sources/power-sources.module').then(
                (m) => m.PowerSourcesModule
              ),
          },

          {
            path: PagesResourcesNavMap.get(PagesResources.GeneratingSetView)
              ?.path,
            loadChildren: () =>
              import('./assets/generating-set/generating-set.module').then(
                (m) => m.GeneratingSetModule
              ),
          },
        ],
      },
      {
        path: PagesResourcesNavMap.get(PagesResources.TariffModuleView)?.path,
        children: [
          {
            path: '',
            redirectTo: PagesResourcesNavMap.get(PagesResources.TariffView)
              ?.path,
            pathMatch: 'prefix',
          },
          {
            path: PagesResourcesNavMap.get(PagesResources.TariffView)?.path,
            loadChildren: () =>
              import('./tariff-management/tariff/tariff.module').then(
                (m) => m.TariffModule
              ),
          },
          {
            path: PagesResourcesNavMap.get(PagesResources.ServiceBandView)
              ?.path,
            loadChildren: () =>
              import(
                './tariff-management/service-band/service-band.module'
              ).then((m) => m.ServiceBandModule),
          },
          {
            path: PagesResourcesNavMap.get(PagesResources.BillingComparisonView)
              ?.path,
            loadChildren: () =>
              import(
                './tariff-management/billing-comparison/billing-comparison.module'
              ).then((m) => m.BillingComparisonModule),
          },
        ],
      },
      {
        path: PagesResourcesNavMap.get(PagesResources.AnalyticsModuleView)
          ?.path,
        children: [
          {
            path: '',
            redirectTo: PagesResourcesNavMap.get(
              PagesResources.PowerSourceAnalyticsView
            )?.path,
            pathMatch: 'prefix',
          },

          {
            path: PagesResourcesNavMap.get(
              PagesResources.LoadPointAnalyticsView
            )?.path,
            data: { assetType: AssetTypeEnum.LOADPOINT },
            loadChildren: () =>
              import(
                './analytics/load-point-analytics/load-point-analytics.module'
              ).then((m) => m.LoadPointAnalyticsModule),
          },
          {
            path: PagesResourcesNavMap.get(
              PagesResources.PowerSourceAnalyticsView
            )?.path,
            data: { assetType: AssetTypeEnum.POWER_SOURCE },
            loadChildren: () =>
              import(
                './analytics/power-source-analytics/power-source-analytics.module'
              ).then((m) => m.PowerSourceAnalyticsModule),
          },
          {
            path: PagesResourcesNavMap.get(
              PagesResources.GeneratingSetAnalyticsView
            )?.path,
            data: { assetType: AssetTypeEnum.GEN_SET },
            loadChildren: () =>
              import(
                './analytics/generating-unit-analytics/generating-unit-analytics.module'
              ).then((m) => m.GeneratingUnitAnalyticsModule),
          },

          {
            path: PagesResourcesNavMap.get(PagesResources.OutageAnalyticsView)
              ?.path,
            data: { assetType: AssetTypeEnum.OUTAGE },
            loadChildren: () =>
              import(
                './analytics/outage-analytics/outage-analytics.module'
              ).then((m) => m.OutageAnalyticsModule),
          },
        ],
      },
      {
        path: PagesResourcesNavMap.get(PagesResources.ReportingView)?.path,
        loadChildren: () =>
          import('./reporting/reporting.module').then((m) => m.ReportingModule),
      },
      {
        path: PagesResourcesNavMap.get(PagesResources.AuditView)?.path,
        loadChildren: () =>
          import('./audit/audit.module').then((m) => m.AuditModule),
      },

      {
        path: PagesResourcesNavMap.get(PagesResources.NotificationView)?.path,
        loadChildren: () =>
          import('./notification/notification.module').then(
            (m) => m.NotificationModule
          ),
      },

      {
        path: PagesResourcesNavMap.get(PagesResources.GridAnalyticsView)?.path,
        loadChildren: () =>
          import('./grid-analytics/grid-analytics.module').then(
            (m) => m.GridAnalyticsModule
          ),
      },
      {
        path: PagesResourcesNavMap.get(PagesResources.ExecutiveSummaryView)
          ?.path,
        loadChildren: () =>
          import('./executive-summary/executive-summary.module').then(
            (m) => m.ExecutiveSummaryModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
