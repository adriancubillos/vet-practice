import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <button mat-icon-button (click)="toggleSidenav()">
        <mat-icon>menu</mat-icon>
      </button>
      <span>Vet Practice</span>
      <span class="toolbar-spacer"></span>
      <button mat-icon-button [matMenuTriggerFor]="profileMenu">
        <mat-icon>account_circle</mat-icon>
      </button>
      <mat-menu #profileMenu="matMenu">
        <button mat-menu-item routerLink="/profile">
          <mat-icon>person</mat-icon>
          <span>Profile</span>
        </button>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
        </button>
      </mat-menu>
    </mat-toolbar>

    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" [opened]="sidenavOpened">
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>

          <mat-divider></mat-divider>
          
          <!-- Pets Section -->
          <h3 matSubheader>Pets</h3>
          <a mat-list-item routerLink="/pets/register" routerLinkActive="active">
            <mat-icon matListItemIcon>pets</mat-icon>
            <span matListItemTitle>Register Pet</span>
          </a>
          <a mat-list-item routerLink="/pets" routerLinkActive="active">
            <mat-icon matListItemIcon>list</mat-icon>
            <span matListItemTitle>Pet List</span>
          </a>

          <mat-divider></mat-divider>

          <!-- Appointments Section -->
          <h3 matSubheader>Appointments</h3>
          <a mat-list-item routerLink="/appointments" routerLinkActive="active">
            <mat-icon matListItemIcon>event</mat-icon>
            <span matListItemTitle>Schedule</span>
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
    .toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .sidenav-container {
      position: absolute;
      top: 64px;
      bottom: 0;
      left: 0;
      right: 0;
    }

    mat-sidenav {
      width: 200px;
      background-color: #fafafa;
    }

    .content {
      padding: 20px;
    }

    .active {
      background-color: rgba(0, 0, 0, 0.04);
    }

    mat-divider {
      margin: 8px 0;
    }

    h3[matSubheader] {
      color: rgba(0, 0, 0, 0.54);
      padding: 16px;
      margin: 0;
      font-size: 14px;
      font-weight: 500;
    }
  `]
})
export class NavMenuComponent {
  sidenavOpened = true;

  constructor(private authService: AuthService) {}

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  logout() {
    this.authService.logout();
  }
}
