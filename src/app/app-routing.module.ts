import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';

import { ShowLandingGuard } from './@core/guards/show-landing.guard';
import { AppResources, AppResourcesNavMap } from './app-resources';

const routes: Routes = [
  {
    path: AppResourcesNavMap.get(AppResources.LandingView)?.path,
    loadChildren: () =>
      import('./pages/landing/landing.module').then((m) => m.LandingModule),
    canActivate: [ShowLandingGuard],
  },

  // {
  //   path: AppResourcesNavMap.get(AppResources.AuthView)?.path,
  //   loadChildren: () =>
  //     import('./pages/auth/auth.module').then((m) => m.AuthModule),
  //   canActivate: [HasPermissionGuard],
  //   canActivateChild: [HasPermissionGuard],
  // },
  // {
  //   path: AppResourcesNavMap.get(AppResources.OccView)?.path,
  //   loadChildren: () =>
  //     import('./pages/occ/occ.module').then((m) => m.OccModule),
  // },
  // {
  //   path: AppResourcesNavMap.get(AppResources.AppView)?.path,
  //   loadChildren: () =>
  //     import('./pages/pages.module').then((m) => m.PagesModule),
  //   canActivate: [HasPermissionGuard, IsAuthenticatedGuard],
  //   canActivateChild: [HasPermissionGuard, IsAuthenticatedGuard],
  // },
  // {
  //   path: AppResourcesNavMap.get(AppResources.ErrorView)?.path,
  //   loadChildren: () =>
  //     import('./pages/exceptions/exceptions.module').then(
  //       (m) => m.ExceptionsModule
  //     ),
  // },
];

@NgModule({
  imports: [
    QuicklinkModule,
    RouterModule.forRoot(routes, { preloadingStrategy: QuicklinkStrategy }),
  ],
  exports: [QuicklinkModule, RouterModule],
})
export class AppRoutingModule {}
