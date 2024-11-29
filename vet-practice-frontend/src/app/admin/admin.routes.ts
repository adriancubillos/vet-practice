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
        path: 'users/new',
        loadComponent: () =>
          import('../users/components/user-create/user-create.component').then(m => m.UserCreateComponent)
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import('../users/components/user-details/user-details.component').then(m => m.UserDetailsComponent)
      },
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      }
    ]
  }
];