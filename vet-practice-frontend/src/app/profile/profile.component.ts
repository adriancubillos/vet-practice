import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../auth/services/auth.service';
import { UserAvatarComponent } from '../shared/components/user-avatar/user-avatar.component';
import { environment } from '../../environments/environment';
import { User } from '../users/models/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    UserAvatarComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  isLoading = false;
  error: string | null = null;
  private subscriptions = new Subscription();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.subscriptions.add(
      this.authService.user$.subscribe({
        next: (user) => {
          this.user = user;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
          this.error = 'Failed to load profile. Please try again later.';
          this.isLoading = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getImageUrl(imageUrl: string | undefined): string | null {
    if (!imageUrl) return null;
    return `${environment.apiUrl}/${imageUrl}`;
  }
}
