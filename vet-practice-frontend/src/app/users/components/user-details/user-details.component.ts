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
  roles = ['CLIENT', 'VET', 'ADMIN'];
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  imageExists = false;
  placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWUiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4NSIgcj0iNDAiIGZpbGw9IiNhYWEiLz4KICA8cGF0aCBkPSJNNDAsOTAgQzQwLDE0MCAxNjAsMTQwIDE2MCw5MCIgc3Ryb2tlPSIjYWFhIiBzdHJva2Utd2lkdGg9IjgiIGZpbGw9Im5vbmUiLz4KPC9zdmc+';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      role: ['', [Validators.required]],
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

  onSubmit(): void {
    if (this.userForm.valid && this.userId) {
      this.isLoading = true;
      const formData = new FormData();

      // Add user data
      const formValue = this.userForm.value;
      Object.keys(formValue).forEach(key => {
        if (key !== 'image' && formValue[key] !== null && formValue[key] !== undefined) {
          formData.append(key, formValue[key]);
        }
      });

      // Add image if selected
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.userService.updateUser(this.userId, formData).subscribe({
        next: () => {
          this.isEditing = false;
          this.loadUser();
          this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.error = 'Failed to update user';
          this.isLoading = false;
          this.snackBar.open('Failed to update user', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.previewImage();
    }
  }

  previewImage(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.userForm.get('image')?.setValue(null);
  }

  getImageUrl(imageUrl: string | undefined): string {
    return imageUrl ? `${environment.apiUrl}/${imageUrl}` : this.placeholderImage;
  }

  checkImageExists(imageUrl: string): void {
    const img = new Image();
    img.onload = () => {
      this.imageExists = true;
    };
    img.onerror = () => {
      this.imageExists = false;
    };
    img.src = this.getImageUrl(imageUrl);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.placeholderImage;
  }

  toggleEdit(): void {
    if (this.isEditing) {
      this.userForm.patchValue(this.user!);
      this.selectedFile = null;
      this.imagePreview = null;
    }
    this.isEditing = !this.isEditing;
  }

  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }
}
