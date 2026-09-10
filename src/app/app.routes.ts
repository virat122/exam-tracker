import { Routes } from '@angular/router';
import { authGuard } from './../app/core/guards/auth-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login')
        .then(m => m.Login)
  },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  {
    path: 'test-entry',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/test-entry/test-entry')
        .then(m => m.TestEntry)
  },

  {
    path: 'analytics',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/analytics/analytics')
        .then(m => m.Analytics)
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];