import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../users/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ]
})
export class ChangePasswordDialogComponent {
  passwordForm: FormGroup;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(32),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // If passwords match, remove the passwordMismatch error
    if (confirmPassword?.hasError('passwordMismatch')) {
      const errors = { ...confirmPassword.errors };
      delete errors['passwordMismatch'];
      confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      const { currentPassword, newPassword } = this.passwordForm.value;
      
      this.userService.updatePassword({ currentPassword, newPassword }).subscribe({
        next: () => {
          this.snackBar.open('Password updated successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating password:', error);
          this.snackBar.open(
            error.error?.message || 'Failed to update password. Please try again.',
            'Close',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            }
          );
          this.isLoading = false;
        }
      });
    }
  }
}
