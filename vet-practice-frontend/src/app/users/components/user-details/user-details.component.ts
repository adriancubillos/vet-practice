import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user.interface';
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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
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
export class UserDetailsComponent implements OnInit {
  userId: number | null = null;
  user: User | null = null;
  userForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  isEditing = false;
  roles = ['user', 'vet', 'admin'];
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  imageExists = false;
  placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWUiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4NSIgcj0iNDAiIGZpbGw9IiNhYWEiLz4KICA8cGF0aCBkPSJNNDAsOTAgQzQwLDE0MCAxNjAsMTQwIDE2MCw5MCIgc3Ryb2tlPSIjYWFhIiBzdHJva2Utd2lkdGg9IjgiIGZpbGw9Im5vbmUiLz4KPC9zdmc+';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.userId = +params['id'];
        this.loadUser();
      }
    });
  }

  loadUser(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.userForm.patchValue(user);
        if (user.imageUrl) {
          this.checkImageExists(user.imageUrl);
        } else {
          this.imageExists = false;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.error = 'Failed to load user details';
        this.isLoading = false;
      }
    });
  }

  checkImageExists(imageUrl: string): void {
    const img = new Image();
    img.src = environment.apiUrl + imageUrl;

    img.onload = () => {
      this.imageExists = true;
    };

    img.onerror = () => {
      this.imageExists = false;
      if (this.user) {
        this.user.imageUrl = '';
      }
    };
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) {
      return this.placeholderImage;
    }
    return `${environment.apiUrl}${imageUrl}`;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.userForm.patchValue(this.user || {});
      if (this.user?.imageUrl) {
        this.imageExists = true;
      }
    }
  }

  onSubmit(): void {
    if (this.userForm.valid && this.userId) {
      const formData = new FormData();
      const formValue = this.userForm.value;

      // Add all form fields to formData
      Object.keys(formValue).forEach(key => {
        if (formValue[key] !== null && formValue[key] !== undefined) {
          formData.append(key, formValue[key]);
        }
      });

      // Add image only if a new one is selected
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      } else if (!this.imageExists || !this.user?.imageUrl) {
        formData.append('imageUrl', '');  // Send empty string when no image
      } else if (this.user && this.user.imageUrl) {
        formData.append('imageUrl', this.user.imageUrl);
      }

      this.userService.updateUser(this.userId, formData).subscribe({
        next: (user) => {
          this.user = user;
          this.snackBar.open('User updated successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/admin/users']);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.snackBar.open('Failed to update user', 'Close', {
            duration: 3000,
          });
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
    if (this.user) {
      this.user.imageUrl = '';
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.placeholderImage;
  }

  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }

  deleteUser() {
    if (!this.user?.id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Uer',
        message: 'Are you sure you want to delete this user? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Keep'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.user?.id) {
        this.userService.deleteUser(this.user.id).subscribe({
          next: () => {
            this.snackBar.open('user deleted successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/admin/users']);
          },
          error: (error) => {
            this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
            console.error('Error deleting user:', error);
          }
        });
      }
    });
  }
}
