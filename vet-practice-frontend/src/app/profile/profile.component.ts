import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetailsComponent } from '../users/components/user-details/user-details.component';
import { UserAvatarComponent } from '../shared/components/user-avatar/user-avatar.component';
import { AuthService } from '../auth/services/auth.service';
import { UserService } from '../users/services/user.service';
import { User } from '../users/models/user.interface';
import { Subscription } from 'rxjs';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    UserDetailsComponent,
    UserAvatarComponent,
    MatDivider
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  error: string | null = null;
  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.authService.user$.subscribe({
        next: (user) => {
          this.user = user;
          this.error = null;
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
          this.error = 'Failed to load user profile';
        }
      })
    );
  }

  getImageUrl(imageUrl: string | null | undefined): string {
    return imageUrl || '';
  }

  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updatePassword(result).subscribe({
          next: (response) => {
            this.snackBar.open(response.message, 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          },
          error: (error) => {
            this.snackBar.open(error.error.message || 'Failed to update password', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
