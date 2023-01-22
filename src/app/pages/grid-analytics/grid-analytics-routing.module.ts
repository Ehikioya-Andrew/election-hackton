import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridAnalyticsComponent } from './grid-analytics.component';

const routes: Routes = [
  {
    path: '',
    component: GridAnalyticsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GridAnalyticsRoutingModule { }
