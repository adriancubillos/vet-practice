import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatCheckboxModule
  ]
})
export class UserDialogComponent implements OnInit {
  form: FormGroup;
  roles$: Observable<RoleInfo[]>;
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private roleService: RoleService,
    @Inject(MAT_DIALOG_DATA) public data: User | null
  ) {
    this.roles$ = this.roleService.getRoles();
    this.form = this.fb.group({
      username: [data?.username || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      firstName: [data?.firstName || '', Validators.required],
      lastName: [data?.lastName || '', Validators.required],
      address: [data?.address || ''],
      phoneNumber: [data?.phoneNumber || ''],
      role: [data?.role || '', Validators.required],
      isActive: [data?.isActive ?? true],
      password: ['', data ? [] : Validators.required],
      image: [null]
    });

    if (data?.imageUrl) {
      this.imagePreview = data.imageUrl;
    }
  }

  ngOnInit() { }

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
