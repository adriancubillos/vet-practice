import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { UserDetailsComponent } from '../users/components/user-details/user-details.component';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../users/models/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    UserDetailsComponent
  ],
  template: `
    <div class="profile-container">
      <app-user-details *ngIf="user" [user]="user" [isProfileView]="true"></app-user-details>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  private subscriptions = new Subscription();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.authService.user$.subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
