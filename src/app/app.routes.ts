import { Routes } from '@angular/router';
import { adminGuard, clientGuard, coursierGuard } from './core/guards/guards';

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
    path: 'forgot-password', // ✅ AVANT le **
    loadComponent: () =>
      import('./features/auth/forget-password/forgot-password')
        .then(m => m.ForgotPassword)
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
  path: 'settings',
  loadComponent: () =>
    import('./features/settings/settings').then(m => m.Settings)
},





  { path: '**', redirectTo: '/login' } // ✅ toujours en dernier

 
];