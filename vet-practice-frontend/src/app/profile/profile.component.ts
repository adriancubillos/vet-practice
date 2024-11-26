import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="profile-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Profile Information</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="profile-info">
            <div class="profile-avatar">
              <mat-icon class="avatar-icon">account_circle</mat-icon>
            </div>
            <div class="profile-details">
              <h2>{{ user?.firstName }} {{ user?.lastName }}</h2>
              <p class="detail-item">
                <mat-icon>email</mat-icon>
                {{ user?.email }}
              </p>
              <p class="detail-item">
                <mat-icon>phone</mat-icon>
                {{ user?.phoneNumber }}
              </p>
              <p class="detail-item">
                <mat-icon>location_on</mat-icon>
                {{ user?.address }}
              </p>
            </div>
          </div>
          <mat-divider></mat-divider>
          <div class="profile-actions">
            <button mat-raised-button color="primary">
              <mat-icon>edit</mat-icon>
              Edit Profile
            </button>
            <button mat-raised-button color="accent">
              <mat-icon>lock</mat-icon>
              Change Password
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .profile-info {
      display: flex;
      gap: 32px;
      margin: 24px 0;
    }

    .profile-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-icon {
      font-size: 100px;
      width: 100px;
      height: 100px;
      color: #666;
    }

    .profile-details {
      flex: 1;
    }

    .profile-details h2 {
      margin: 0 0 16px 0;
      color: #333;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
      color: #666;
    }

    .detail-item mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .profile-actions {
      margin-top: 24px;
      display: flex;
      gap: 16px;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // TODO: Get user profile from AuthService
    this.user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '(555) 123-4567',
      address: '123 Main St, City, Country'
    };
  }
}
