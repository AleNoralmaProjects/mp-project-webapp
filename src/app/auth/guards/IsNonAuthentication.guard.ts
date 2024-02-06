import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interface/auth.interface';

export const isNonAuthenticationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.authStatus() === AuthStatus.authentication) {
    console.log(authService.currentlyUser()?.role);
    switch (authService.currentlyUser()?.role) {
      case 'ADMINISTRADOR':
        router.navigateByUrl('/protectedroute/administrador/pages/home');

        break;
      case 'EAIS':
        router.navigateByUrl('/protectedroute/eais/pages/home');

        break;

      default:
        break;
    }
    return false;
  }
  return true;
};
