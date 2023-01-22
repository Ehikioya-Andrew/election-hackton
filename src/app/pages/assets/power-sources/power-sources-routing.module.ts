import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PowerSourcesComponent } from './power-sources.component';

const routes: Routes = [
  {  path: '',
  component: PowerSourcesComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PowerSourcesRoutingModule { }
