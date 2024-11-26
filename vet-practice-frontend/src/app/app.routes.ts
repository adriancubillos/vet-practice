import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './auth/auth.routes';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/register', pathMatch: 'full' },
  { path: 'auth', children: AUTH_ROUTES }
];
