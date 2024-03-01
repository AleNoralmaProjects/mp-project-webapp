import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanMatchFn = (route, segments) => {
  //INJECCION DE DEPENDENCIAS
  const authService = inject(AuthService);
  const router = inject(Router);

  const roleExpected = route.data && route.data['role'];
  const currenctRole = authService.currentlyUser()?.role;

  if (currenctRole !== roleExpected) {
    return router.parseUrl(router.url);
  }

  return true;
};
