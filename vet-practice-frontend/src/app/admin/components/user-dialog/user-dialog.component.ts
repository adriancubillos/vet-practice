import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { User } from '../../services/user.service';
import { RoleService, RoleInfo } from '../../../auth/services/role.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule
  ]
})
export class UserDialogComponent implements OnInit {
  form!: FormGroup;
  roles$: Observable<RoleInfo[]>;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  hidePassword = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private roleService: RoleService,
    @Inject(MAT_DIALOG_DATA) public data: User | null
  ) {
    this.roles$ = this.roleService.getRoles();
    this.initializeForm();

    if (data?.imageUrl) {
      this.imagePreview = data.imageUrl;
    }
  }

  ngOnInit() { }

  private initializeForm() {
    this.form = this.fb.group({
      username: [this.data?.username || '', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]],
      email: [this.data?.email || '', [
        Validators.required,
        Validators.email
      ]],
      firstName: [this.data?.firstName || '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      lastName: [this.data?.lastName || '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      address: [this.data?.address || '', [
        Validators.maxLength(200)
      ]],
      phoneNumber: [this.data?.phoneNumber || '', [
        Validators.pattern(/^\+?[1-9]\d{1,14}$/)
      ]],
      role: [this.data?.role || '', Validators.required],
      isActive: [this.data?.isActive ?? true],
      password: ['', this.data ? [] : [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(32),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]]
    });
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
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

    if (field === 'firstName' || field === 'lastName') {
      if (control.hasError('minlength')) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least 2 characters`;
      }
      if (control.hasError('maxlength')) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} cannot exceed 50 characters`;
      }
    }

    if (field === 'password') {
      if (control.hasError('minlength')) {
        return 'Password must be at least 8 characters';
      }
      if (control.hasError('maxlength')) {
        return 'Password cannot exceed 32 characters';
      }
      if (control.hasError('pattern')) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
      }
    }

    if (field === 'phoneNumber' && control.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }

    return '';
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = new FormData();
      const formValue = this.form.value;

      Object.keys(formValue).forEach(key => {
        if (key !== 'image' && formValue[key] !== null && formValue[key] !== undefined) {
          formData.append(key, formValue[key]);
        }
      });

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      this.dialogRef.close(formData);
    }
  }
}
