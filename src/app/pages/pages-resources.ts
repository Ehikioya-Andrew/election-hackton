import { ResourceNavModel } from "../@core/models/resource-nav.model";

export enum PagesResources {
    DashboardView = 'pages:dashboard-view',
    StreetlightView = 'pages:street-light-view',
    UsersView = 'pages:users-view',
    ClientsView = 'pages:clients-view',
    AssetsView = 'pages:assets-view',
    MetersView = 'pages:meters-view',
    LoadPointsView = 'pages:load-points-view',
    PowerStationsView = 'pages:power-stations-view',
    GeneratingSetView = 'pages:generating-units-view',
    TariffModuleView = 'pages:tariff-management-view',
    TariffView = 'pages:tarrif-view',
    BillingComparisonView = 'pages:billing-comparison-view',
    ServiceBandView = 'pages:service-band-view',
    AnalyticsModuleView = 'pages:analytics-module-view',
    PowerSourceAnalyticsView = 'pages:power-source-analytics-view',
    GeneratingSetAnalyticsView = 'pages:generating-set-analytics-view',
    LoadPointAnalyticsView = 'pages:load-point-analytics-view',
    OutageAnalyticsView = 'pages:outage-analytics-view',
    ReportingView = 'pages:reporting-view',
    AuditView = 'pages:audit-view',
    NotificationView = 'pages:notification-view',
    GridAnalyticsView = 'pages:grid-analytics-view',
    ExecutiveSummaryView = 'pages:executive-summary-view'
}

export const PagesResourcesNavMap = new Map<PagesResources, ResourceNavModel>([
    [
        PagesResources.DashboardView,
        {
            route: `/app/dashboard`,
            path: 'dashboard'
        }
    ],
    [
        PagesResources.StreetlightView,
        {
            route: `/app/street-light`,
            path: 'street-light'
        }
    ],
    [
        PagesResources.UsersView,
        {
            route: `/app/users`,
            path: 'users'
        }
    ],
    [
        PagesResources.ClientsView,
        {
            route: `/app/clients`,
            path: 'clients'
        }
    ],
    [
        PagesResources.AssetsView,
        {
            route: `/app/assets`,
            path: 'assets'
        }
    ],
    [
        PagesResources.MetersView,
        {
            route: `/app/assets/meters`,
            path: 'meters'
        }
    ],
    [
        PagesResources.LoadPointsView,
        {
            route: `/app/assets/load-points`,
            path: 'load-points'
        }
    ],
    [
        PagesResources.PowerStationsView,
        {
            route: `/app/assets/power-stations`,
            path: 'power-stations'
        }
    ],

    [
        PagesResources.GeneratingSetView,
        {
            route: `/app/assets/generating-units`,
            path: 'generating-units'
        }
    ],
    [
        PagesResources.TariffModuleView,
        {
            route: `/app/tariff-management`,
            path: 'tariff-management'
        }
    ],
    [
        PagesResources.TariffView,
        {
            route: `/app/tariff-management/tariff`,
            path: 'tariff'
        }
    ],
    [
        PagesResources.BillingComparisonView,
        {
            route: `/app/tariff-management/billing-comparison`,
            path: 'billing-comparison'
        }
    ],
    [
        PagesResources.ServiceBandView,
        {
            route: `/app/tariff-management/service-band`,
            path: 'service-band'
        }
    ],
    [
        PagesResources.AnalyticsModuleView,
        {
            route: `/app/analytics`,
            path: 'analytics'
        }
    ],
    [
        PagesResources.PowerSourceAnalyticsView,
        {
            route: `/app/analytics/power-source-analytics`,
            path: 'power-source-analytics'
        }
    ],
    [
        PagesResources.GeneratingSetAnalyticsView,
        {
            route: `/app/analytics/generating-unit-analytics`,
            path: 'generating-unit-analytics'
        }
    ],

    [
        PagesResources.LoadPointAnalyticsView,
        {
            route: `/app/analytics/load-point-analytics`,
            path: 'load-point-analytics'
        }
    ],
    [
        PagesResources.OutageAnalyticsView,
        {
            route: `/app/analytics/outage-analytics`,
            path: 'outage-analytics'
        }
    ],
    [
        PagesResources.ReportingView,
        {
            route: `/app/reporting`,
            path: 'reporting'
        }
    ],
    [
        PagesResources.AuditView,
        {
            route: `/app/audit`,
            path: 'audit'
        }
    ],
    [
        PagesResources.NotificationView,
        {
            route: `/app/notification`,
            path: 'notification'
        }
    ],
    [
        PagesResources.GridAnalyticsView,
        {
            route: `/app/grid-analytics`,
            path: 'grid-analytics'
        }
    ],
    [
        PagesResources.ExecutiveSummaryView,
        {
            route: `/app/executive-summary`,
            path: 'executive-summary'
        }
    ],
    

])
