import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const loadModuleGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.checkAuthStatus()) {
    return true;
  }
  router.navigateByUrl('/auth/login');
  return false;
};
