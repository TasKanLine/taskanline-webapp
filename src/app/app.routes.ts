import { Routes } from '@angular/router';
import { Signup } from '@features/signup/signup';
import { Login } from '@features/login/login';

export const routes: Routes = [
  { path: 'reference', loadComponent: () => import('./features/reference/reference').then((m) => m.Reference) },
  { path: 'profile', loadComponent: () => import('./features/profile/profile').then((m) => m.Profile) },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
];
