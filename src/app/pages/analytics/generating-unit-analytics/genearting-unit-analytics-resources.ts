import { ResourceNavModel } from "src/app/@core/models/resource-nav.model";

export enum GeneratingUnitAnalyticsResources {
    SummaryView = 'generating-unit-analytics:summary-view',
    ExpandedView = 'generating-unit-analytics:expanded-view',
}

export const GeneratingUnitAnalyticsResourcesNavMap = new Map<GeneratingUnitAnalyticsResources, ResourceNavModel>([
    [
        GeneratingUnitAnalyticsResources.SummaryView,
        {
            route: `/app/analytics/generating-unit-analytics/summary`,
            path: 'summary'
        }
    ],
    [
        GeneratingUnitAnalyticsResources.ExpandedView,
        {
            route: `/app/analytics/generating-unit-analytics/expanded`,
            path: 'expanded'
        }
    ],

])
