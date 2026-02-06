import { Routes } from '@angular/router';
import { Home } from './home';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: Home,
    children: [
      { path: 'calendar', redirectTo: 'issues', pathMatch: 'full' },
      { path: 'team', redirectTo: 'issues', pathMatch: 'full' },
      { path: 'issues', loadComponent: () => import('../issues/issues').then((m) => m.Issues) },
      { path: 'issues/:id', loadComponent: () => import('../issues/issues').then((m) => m.Issues) },
      { path: 'issues/:id/edit', loadComponent: () => import('../issues/issues').then((m) => m.Issues) },
      { path: 'issues/new', loadComponent: () => import('../issues/issues').then((m) => m.Issues) },
    ],
  },
];
