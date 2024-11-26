import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    RouterModule
  ],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      
      <mat-grid-list cols="2" rowHeight="140px" gutterSize="16">
        <!-- Today's Appointments -->
        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-content>
              <div class="card-content">
                <mat-icon class="card-icon" color="primary">event</mat-icon>
                <div class="card-info">
                  <h3>Today's Appointments</h3>
                  <p class="stat">8</p>
                  <a routerLink="/appointments" class="view-all">View All</a>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Total Patients -->
        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-content>
              <div class="card-content">
                <mat-icon class="card-icon" color="accent">pets</mat-icon>
                <div class="card-info">
                  <h3>Total Patients</h3>
                  <p class="stat">156</p>
                  <a routerLink="/patients" class="view-all">View All</a>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Pending Appointments -->
        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-content>
              <div class="card-content">
                <mat-icon class="card-icon" color="warn">schedule</mat-icon>
                <div class="card-info">
                  <h3>Pending Appointments</h3>
                  <p class="stat">12</p>
                  <a routerLink="/appointments" class="view-all">View All</a>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Recent Updates -->
        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-content>
              <div class="card-content">
                <mat-icon class="card-icon" color="primary">notifications</mat-icon>
                <div class="card-info">
                  <h3>Recent Updates</h3>
                  <p class="stat">5</p>
                  <a href="#" class="view-all">View All</a>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>

      <!-- Recent Activity -->
      <mat-card class="activity-card">
        <mat-card-header>
          <mat-card-title>Recent Activity</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="activity-item">
            <mat-icon color="primary">check_circle</mat-icon>
            <div class="activity-details">
              <p class="activity-text">Appointment completed with Max (Checkup)</p>
              <p class="activity-time">2 hours ago</p>
            </div>
          </div>
          <div class="activity-item">
            <mat-icon color="accent">schedule</mat-icon>
            <div class="activity-details">
              <p class="activity-text">New appointment scheduled for Bella</p>
              <p class="activity-time">3 hours ago</p>
            </div>
          </div>
          <div class="activity-item">
            <mat-icon color="warn">pets</mat-icon>
            <div class="activity-details">
              <p class="activity-text">New patient registered: Charlie</p>
              <p class="activity-time">5 hours ago</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }

    h1 {
      margin: 0 0 24px 0;
      font-size: 24px;
      color: #333;
    }

    .dashboard-card {
      width: 100%;
      height: 100%;
    }

    .card-content {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 16px;
    }

    .card-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-right: 24px;
    }

    .card-info {
      flex: 1;
    }

    .card-info h3 {
      margin: 0;
      font-size: 16px;
      color: #666;
    }

    .stat {
      margin: 8px 0;
      font-size: 32px;
      font-weight: bold;
      color: #333;
    }

    .view-all {
      color: #1976d2;
      text-decoration: none;
      font-size: 14px;
    }

    .activity-card {
      margin-top: 24px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #eee;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-item mat-icon {
      margin-right: 16px;
    }

    .activity-details {
      flex: 1;
    }

    .activity-text {
      margin: 0;
      color: #333;
    }

    .activity-time {
      margin: 4px 0 0 0;
      font-size: 12px;
      color: #666;
    }
  `]
})
export class DashboardComponent {}
