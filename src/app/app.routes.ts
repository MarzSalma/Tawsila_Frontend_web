import { Routes } from '@angular/router';
import { adminGuard, clientGuard, coursierGuard, merchantGuard } from './core/guards/guards';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },
  {
    path: 'register-merchant', // ✅
    loadComponent: () => import('./features/auth/register-merchant/register-merchant').then(m => m.RegisterMerchant)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/forget-password/forgot-password').then(m => m.ForgotPassword)
  },
  {
    path: 'admin/profile',
    loadComponent: () => import('./features/admin/profile/profile').then(m => m.Profile),
    canActivate: [adminGuard]
  },
  {
    path: 'client/profile',
    loadComponent: () => import('./features/client/profile/profile').then(m => m.Profile),
    canActivate: [clientGuard]
  },
  {
    path: 'coursier/profile',
    loadComponent: () => import('./features/coursier/profile/profile').then(m => m.Profile),
    canActivate: [coursierGuard]
  },
  {
    path: 'merchant/profile', // ✅
    loadComponent: () => import('./features/merchant/profile/merchant-profile').then(m => m.MerchantProfile),
    canActivate: [merchantGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings').then(m => m.Settings)
  },
  { path: '**', redirectTo: '/login' }
];