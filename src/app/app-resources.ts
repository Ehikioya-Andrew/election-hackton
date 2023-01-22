import { ResourceNavModel } from './@core/models/resource-nav.model';

export enum AppResources {
  LandingView = 'app:landing-view',
  AuthView = 'app:auth-view',
  AppView = 'app:app-view',
  ErrorView = 'app:error-view',
  OccView = 'app:occ-view',
}

export const AppResourcesNavMap = new Map<AppResources, ResourceNavModel>([
  [
    AppResources.LandingView,
    {
      route: '/',
      path: '',
    },
  ],
]);
