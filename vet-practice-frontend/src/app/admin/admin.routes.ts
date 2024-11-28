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
          import('./components/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      }
    ]
  }
];
