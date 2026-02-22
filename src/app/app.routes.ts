// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { adminGuard, clientGuard, coursierGuard } from './core/guards/guards'; // ✅ chemin complet avec /guards

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
    path: 'admin/dashboard',
    loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.Dashboard),
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
  { path: '**', redirectTo: '/login' }
];