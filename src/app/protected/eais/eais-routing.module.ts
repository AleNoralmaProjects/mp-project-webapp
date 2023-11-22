import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EaisHomeComponent } from './layout/eais-home/eais-home.component';

const routes: Routes = [
  {
    path: 'inicio',
    component: EaisHomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EaisRoutingModule {}
