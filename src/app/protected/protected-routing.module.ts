import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../auth/page-not-found/page-not-found.component';
import { roleGuard } from '../auth/guards/role.guard';

const routes: Routes = [
  {
    path: 'administrador',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canMatch: [roleGuard],
    data: { role: 'ADMINISTRADOR' },
  },
  {
    path: 'eais',
    loadChildren: () => import('./eais/eais.module').then((m) => m.EaisModule),
    canMatch: [roleGuard],
    data: { role: 'EAIS' },
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
  {
    path: '',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtectedRoutingModule {}
