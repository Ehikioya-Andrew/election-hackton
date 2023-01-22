import { ResourceNavModel } from "src/app/@core/models/resource-nav.model";

export enum PowerSourceAnalyticsResources {
    SummaryView = 'power-source-analytics:summary-view',
    ExpandedView = 'power-source-analytics:expanded-view',
}

export const PowerSourceAnalyticsResourcesNavMap = new Map<PowerSourceAnalyticsResources, ResourceNavModel>([
    [
        PowerSourceAnalyticsResources.SummaryView,
        {
            route: `/app/analytics/power-source-analytics/summary`,
            path: 'summary'
        }
    ],
    [
        PowerSourceAnalyticsResources.ExpandedView,
        {
            route: `/app/analytics/power-source-analytics/expanded`,
            path: 'expanded'
        }
    ],

])
