import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './layout/admin-home/admin-home.component';
import { PageNotFoundComponent } from 'src/app/auth/page-not-found/page-not-found.component';
import { ViewMapComponent } from './pages/view-map/view-map.component';
import { BrigadaEaisComponent } from './pages/brigada-eais/brigada-eais.component';
import { ManageProfessionalComponent } from './pages/manage-professional/manage-professional.component';
import { ManageProfessionComponent } from './pages/manage-profession/manage-profession.component';
import { ManageInfoeaisComponent } from './pages/manage-infoeais/manage-infoeais.component';

const routes: Routes = [
  {
    path: 'pages',
    component: AdminHomeComponent,

    children: [
      {
        path: 'home',
        component: ViewMapComponent,
      },
      {
        path: 'brigada-eais',
        component: BrigadaEaisComponent,
      },
      {
        path: 'manage-professional',
        component: ManageProfessionalComponent,
      },
      {
        path: 'manage-profession',
        component: ManageProfessionComponent,
      },
      {
        path: 'manage-infoeais',
        component: ManageInfoeaisComponent,
      },
      {
        path: '**',
        component: PageNotFoundComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'pages',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
