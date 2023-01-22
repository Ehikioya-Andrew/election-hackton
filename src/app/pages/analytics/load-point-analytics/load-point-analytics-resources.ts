import { ResourceNavModel } from "src/app/@core/models/resource-nav.model";

export enum LoadPointAnalyticsResources {
    SummaryView = 'load-point-analytics:summary-view',
    ExpandedView = 'load-point-analytics:expanded-view',
}

export const LoadPointAnalyticsResourcesNavMap = new Map<LoadPointAnalyticsResources, ResourceNavModel>([
    [
        LoadPointAnalyticsResources.SummaryView,
        {
            route: `/app/analytics/load-point-analytics/summary`,
            path: 'summary'
        }
    ],
    [
        LoadPointAnalyticsResources.ExpandedView,
        {
            route: `/app/analytics/load-point-analytics/expanded`,
            path: 'expanded'
        }
    ],

])
