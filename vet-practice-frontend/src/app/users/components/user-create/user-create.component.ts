import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatCardModule
  ]
})
export class UserCreateComponent {
  userForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  roles = ['user', 'vet', 'admin'];
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  imageExists = false;
  hidePassword = true;
  placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWUiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4NSIgcj0iNDAiIGZpbGw9IiNhYWEiLz4KICA8cGF0aCBkPSJNNDAsOTAgQzQwLDE0MCAxNjAsMTQwIDE2MCw5MCIgc3Ryb2tlPSIjYWFhIiBzdHJva2Utd2lkdGg9IjgiIGZpbGw9Im5vbmUiLz4KPC9zdmc+';

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(32),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      address: ['', [
        Validators.required,
        Validators.maxLength(200)
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^\+?[1-9]\d{1,14}$/)
      ]],
      role: ['user', [Validators.required]],
      image: [null]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = new FormData();
      const formValue = this.userForm.value;

      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...userData } = formValue;

      console.log("formValue ==> ", formValue)

      // Add all form fields to formData
      Object.keys(userData).forEach(key => {
        if (userData[key] !== null && userData[key] !== undefined) {
          formData.append(key, userData[key]);
        }
      });

      // Add image only if a new one is selected
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
        // Don't send imageUrl - let backend generate the proper filename with timestamp/uuid
      } else if (!this.imageExists || formValue.imageUrl) {
        formData.append('imageUrl', '');  // Send empty string when no image
      } else if (formValue && formValue.imageUrl) {
        formData.append('imageUrl', formValue.imageUrl);
      }


      for (const [key, value] of formData.entries()) {
        console.log("key: ", key, "value: ", value);
      }

      this.isLoading = true;
      this.userService.createUser(formData).subscribe({
        next: () => {
          this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/users']);
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.snackBar.open(
            error.error?.message || 'Failed to create user',
            'Close',
            { duration: 3000 }
          );
          this.isLoading = false;
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.imageExists = true;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.imageExists = false;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.placeholderImage;
  }

  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }

  getErrorMessage(field: string): string {
    const control = this.userForm.get(field);
    if (!control) return '';

    if (control.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }

    if (field === 'email' && control.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (field === 'username') {
      if (control.hasError('minlength')) {
        return 'Username must be at least 4 characters';
      }
      if (control.hasError('maxlength')) {
        return 'Username cannot exceed 20 characters';
      }
    }

    if (field === 'password') {
      if (control.hasError('minlength')) {
        return 'Password must be at least 6 characters';
      }
      if (control.hasError('maxlength')) {
        return 'Password cannot exceed 32 characters';
      }
      if (control.hasError('pattern')) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and special character';
      }
    }

    if (field === 'confirmPassword' && this.userForm.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }

    if (field === 'firstName' || field === 'lastName') {
      if (control.hasError('minlength')) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least 2 characters`;
      }
      if (control.hasError('maxlength')) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} cannot exceed 50 characters`;
      }
    }

    if (field === 'address' && control.hasError('maxlength')) {
      return 'Address cannot exceed 200 characters';
    }

    if (field === 'phoneNumber' && control.hasError('pattern')) {
      return 'Please enter a valid phone number with country code (e.g., +1234567890)';
    }

    return '';
  }
}
