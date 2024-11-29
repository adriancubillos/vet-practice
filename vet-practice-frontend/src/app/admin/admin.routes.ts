import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('../users/components/user-list/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      }
    ]
  }
];