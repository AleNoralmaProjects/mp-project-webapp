import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EaisHomeComponent } from './layout/eais-home/eais-home.component';
import { EaisInformationComponent } from './pages/eais-information/eais-information.component';
import { EaisProfileComponent } from './pages/eais-profile/eais-profile.component';
import { PageNotFoundComponent } from 'src/app/auth/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'pages',
    component: EaisHomeComponent,
    children: [
      {
        path: 'home',
        component: EaisInformationComponent,
      },
      {
        path: 'eais-profile',
        component: EaisProfileComponent,
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
export class EaisRoutingModule {}
