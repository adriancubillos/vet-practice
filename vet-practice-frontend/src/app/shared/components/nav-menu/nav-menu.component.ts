import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../auth/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatIconModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" [opened]="sidenavOpened" class="sidenav">
        <div class="user-info" *ngIf="user$ | async as user">
          <mat-icon class="user-icon">account_circle</mat-icon>
          <div class="user-details">
            <span class="username">{{ user.username }}</span>
            <span class="role">{{ user.role || 'User' }}</span>
          </div>
        </div>

        <mat-nav-list>
          <h3 matSubheader>Main</h3>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>

          <mat-divider></mat-divider>
          <h3 matSubheader>Pets</h3>
          <a mat-list-item routerLink="/pets" routerLinkActive="active">
            <mat-icon matListItemIcon>pets</mat-icon>
            <span matListItemTitle>My Pets</span>
          </a>

          <mat-divider></mat-divider>
          <h3 matSubheader>Appointments</h3>
          <a mat-list-item routerLink="/appointments" routerLinkActive="active">
            <mat-icon matListItemIcon>event</mat-icon>
            <span matListItemTitle>Schedule</span>
          </a>

          <ng-container *ngIf="isAdmin$ | async">
            <mat-divider></mat-divider>
            <h3 matSubheader>Admin</h3>
            <a mat-list-item routerLink="/admin/users" routerLinkActive="active">
              <mat-icon matListItemIcon>people</mat-icon>
              <span matListItemTitle>User Management</span>
            </a>
          </ng-container>

          <mat-divider></mat-divider>
          <a mat-list-item (click)="logout()">
            <mat-icon matListItemIcon>exit_to_app</mat-icon>
            <span matListItemTitle>Logout</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content [style.margin-left.px]="sidenavOpened ? 200 : 0">
        <div class="content">
          <ng-content></ng-content>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100%;
    }
    .sidenav {
      width: 200px;
      background: #fafafa;
    }
    .user-info {
      padding: 16px;
      display: flex;
      align-items: center;
      background: #f0f0f0;
    }
    .user-icon {
      margin-right: 8px;
      font-size: 40px;
      width: 40px;
      height: 40px;
    }
    .user-details {
      display: flex;
      flex-direction: column;
    }
    .username {
      font-weight: 500;
    }
    .role {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
    }
    .content {
      padding: 20px;
    }
    .active {
      background: rgba(0, 0, 0, 0.04);
    }
  `]
})
export class NavMenuComponent {
  sidenavOpened = true;
  user$: Observable<any | null>;
  isAdmin$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
    this.isAdmin$ = this.authService.user$.pipe(
      map((user: any | null) => user?.role === 'admin')
    );
  }

  logout() {
    this.authService.logout();
  }
}
