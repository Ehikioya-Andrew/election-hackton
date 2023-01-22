import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StreetLightComponent } from './street-light.component';

const routes: Routes = [
  {
    path: '',
    component: StreetLightComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StreetLightRoutingModule { }
