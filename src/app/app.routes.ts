
import { Routes } from '@angular/router';

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
    loadComponent: () =>
      import('./features/dashboard/dashboard')
        .then(m => m.Dashboard)
  },
  {
    path: 'test-entry',
    loadComponent: () =>
      import('./features/test-entry/test-entry')
        .then(m => m.TestEntry)
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./features/analytics/analytics')
        .then(m => m.Analytics)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];