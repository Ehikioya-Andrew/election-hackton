import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetersComponent } from './meters.component';

const routes: Routes = [
  {  path: '',
    component: MetersComponent
  }
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetersRoutingModule { }

