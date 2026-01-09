import { Routes } from '@angular/router';
import { Signup } from '@features/signup/signup';
import { Login } from '@features/login/login';
import { Home } from '@features/home/home';

export const routes: Routes = [
  { path: 'reference', loadComponent: () => import('./features/reference/reference').then((m) => m.Reference) },
  { path: 'profile', loadComponent: () => import('./features/profile/profile').then((m) => m.Profile) },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: '', component: Home },
  {
    path: 'error/403',
    loadComponent: () => import('./features/errors/forbidden/forbidden').then((m) => m.Forbidden),
  },
  {
    path: 'error/500',
    loadComponent: () => import('./features/errors/server-error/server-error').then((m) => m.ServerError),
  },
  { path: '**', loadComponent: () => import('./features/errors/not-found/not-found').then((m) => m.NotFound) },
];
