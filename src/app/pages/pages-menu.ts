import { NbMenuItem } from '@nebular/theme';
import { GlobalResources } from '../@core/maps/global-resources';
import { GeneratingUnitAnalyticsResources } from './analytics/generating-unit-analytics/genearting-unit-analytics-resources';
import { LoadPointAnalyticsResources } from './analytics/load-point-analytics/load-point-analytics-resources';
import { PowerSourceAnalyticsResources } from './analytics/power-source-analytics/power-source-analytics-resources';
import { PagesResources } from './pages-resources';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home',
    link: GlobalResources.get(PagesResources.DashboardView)?.route,
    home: true,
  },
  {
    title: 'Executive Summary ',
    icon: 'clipboard-outline',
    link: GlobalResources.get(PagesResources.ExecutiveSummaryView)?.route,
  },
  {
    title: 'Street Lights',
    icon: 'bulb-outline',
    link: GlobalResources.get(PagesResources.StreetlightView)?.route,
  },
  {
    title: 'Grid Analytics',
    link: GlobalResources.get(PagesResources.GridAnalyticsView)?.route,
    icon: 'bar-chart-outline',
  },
  {
    title: 'MODULES',
    group: true,
  },
  {
    title: 'Users',
    link: GlobalResources.get(PagesResources.UsersView)?.route,
    icon: 'people-outline',
  },
  {
    title: 'Clients',
    link: GlobalResources.get(PagesResources.ClientsView)?.route,
    icon: 'clipboard-outline',
  },
  {
    title: 'Assets',
    icon: 'briefcase-outline',
    children: [
      {
        title: 'Meters',
        link: GlobalResources.get(PagesResources.MetersView)?.route,
        icon: 'speaker-outline',
      },
      {
        title: 'Load Points',
        link: GlobalResources.get(PagesResources.LoadPointsView)?.route,
        icon: 'code-download-outline',
      },
      {
        title: 'Power Stations',
        link: GlobalResources.get(PagesResources.PowerStationsView)?.route,
        icon: 'wifi-outline',
      },
      {
        title: 'Generating Units',
        link: GlobalResources.get(PagesResources.GeneratingSetView)?.route,
        icon: 'options-outline',
      },
    ],
  },
  {
    title: 'Tariff Management',
    icon: 'clipboard-outline',
    children: [
      {
        title: 'Tariff Management',
        link: GlobalResources.get(PagesResources.TariffView)?.route,
        icon: 'speaker-outline',
      },
      {
        title: 'Billing and Comparison',
        link: GlobalResources.get(PagesResources.BillingComparisonView)?.route,
        icon: 'code-download-outline',
      },
    ],
  },
  {
    title: 'Analytics',
    icon: 'briefcase-outline',
    children: [
      {
        title: 'Power Station',
        link: GlobalResources.get(PowerSourceAnalyticsResources.SummaryView)
          ?.route,
        icon: 'speaker-outline',
      },
      {
        title: 'Load Point',
        link: GlobalResources.get(LoadPointAnalyticsResources.SummaryView)
          ?.route,
        icon: 'speaker-outline',
      },
      {
        title: 'Generating Unit',
        link: GlobalResources.get(GeneratingUnitAnalyticsResources.SummaryView)
          ?.route,
        icon: 'speaker-outline',
      },
      {
        title: 'Outage',
        link: GlobalResources.get(PagesResources.OutageAnalyticsView)?.route,
        icon: 'speaker-outline',
      },
    ],
  },

  {
    title: 'Reporting',
    link: GlobalResources.get(PagesResources.ReportingView)?.route,
    icon: 'book-outline',
  },

  {
    title: 'Audit',
    link: GlobalResources.get(PagesResources.AuditView)?.route,
    icon: 'checkmark-square-2-outline',
  },
  {
    title: 'Notifications',
    link: GlobalResources.get(PagesResources.NotificationView)?.route,
    icon: 'bell-outline',
  },
];
