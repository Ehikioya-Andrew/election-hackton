import { ResourceNavModel } from 'src/app/@core/models/resource-nav.model';

export enum OccResources {
  AssetSummaryView = 'occ:asset-summary-view',
  GeneratingSetDashboardtView = 'occ:generating-set-dashboard-view',
  GridAnalyticsDashboardView = 'occ:grid-analytics-dashboard-view',
  LoadPointDashboardView = 'occ:load-point-dashboard-view',
  PowerStationDashboardView = 'occ:power-station-dashboard-view',
  StreetlightDashboardView = 'occ:streetlight-dashboard-view',
}

export const OccResourcesNavMap = new Map<OccResources, ResourceNavModel>([
  [
    OccResources.AssetSummaryView,
    {
      route: `/occ/asset-summary`,
      path: 'asset-summary',
    },
  ],

  [
    OccResources.GeneratingSetDashboardtView,
    {
      route: `/occ/generating-set-dashboard`,
      path: 'generating-set-dashboard',
    },
  ],

  [
    OccResources.GridAnalyticsDashboardView,
    {
      route: `/occ/grid-analytics-dashboard`,
      path: 'grid-analytics-dashboard',
    },
  ],

  [
    OccResources.LoadPointDashboardView,
    {
      route: `/occ/load-point-dashboard`,
      path: 'load-point-dashboard',
    },
  ],

  [
    OccResources.PowerStationDashboardView,
    {
      route: `/occ/power-station-dashboard`,
      path: 'power-station-dashboard',
    },
  ],

  [
    OccResources.StreetlightDashboardView,
    {
      route: `/occ/streetlight-dashboard`,
      path: 'streetlight-dashboard',
    },
  ],
]);
