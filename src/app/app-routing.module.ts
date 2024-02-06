import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './auth/page-not-found/page-not-found.component';
import { isNonAuthenticationGuard } from './auth/guards/IsNonAuthentication.guard';
import { isAuthenticationGuard } from './auth/guards/IsAuthentication.guard';
import { loadModuleGuard } from './auth/guards/loadModule.guard';

const routes: Routes = [
  {
    path: 'auth',
    /* canActivate: [isNonAuthenticationGuard], */
    loadChildren: () =>
      import('./auth/auth.module').then((module) => module.AuthModule),
  },
  {
    path: 'protectedroute',
    /* canActivate: [isAuthenticationGuard],
    canMatch: [loadModuleGuard], */
    loadChildren: () =>
      import('./protected/protected.module').then((m) => m.ProtectedModule),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
