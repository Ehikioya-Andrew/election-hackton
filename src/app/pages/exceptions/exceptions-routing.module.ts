import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  ExceptionResources,
  ExceptionResourcesNavMap,
} from './exceptions-resources';
import { ExceptionsComponent } from './exceptions.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UnauthorisedComponent } from './unauthorised/unauthorised.component';
import { UserIdleComponent } from './user-idle/user-idle.component';

const routes: Routes = [
  {
    path: '',
    component: ExceptionsComponent,
    children: [
      {
        path: '',
        redirectTo: ExceptionResourcesNavMap.get(
          ExceptionResources.PageNotFoundView
        )?.path,
        pathMatch: 'prefix',
      },
      {
        path: ExceptionResourcesNavMap.get(ExceptionResources.UserIdleView)
          ?.path,
        component: UserIdleComponent,
      },
      {
        path: ExceptionResourcesNavMap.get(ExceptionResources.UnauthorisedView)
          ?.path,
        component: UnauthorisedComponent,
      },
      {
        path: ExceptionResourcesNavMap.get(ExceptionResources.PageNotFoundView)
          ?.path,
        component: PageNotFoundComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: ExceptionResourcesNavMap.get(
      ExceptionResources.PageNotFoundView
    )?.path,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExceptionsRoutingModule {}
