import { Routes } from '@angular/router';
import { Signup } from '@features/signup/signup';
import { Login } from '@features/login/login';

export const routes: Routes = [
  { path: 'reference', loadComponent: () => import('./features/reference/reference').then((m) => m.Reference) },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
];
