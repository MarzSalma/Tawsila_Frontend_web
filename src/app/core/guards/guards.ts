import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  router.navigate(['/login']);
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn() && auth.isAdmin()) return true;
  router.navigate(['/login']);
  return false;
};

export const clientGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn() && auth.isClient()) return true;
  router.navigate(['/login']);
  return false;
};

export const coursierGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn() && auth.isCoursier()) return true;
  router.navigate(['/login']);
  return false;
};

export const merchantGuard: CanActivateFn = () => { // ✅
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn() && auth.isMerchant()) return true;
  router.navigate(['/login']);
  return false;
};
