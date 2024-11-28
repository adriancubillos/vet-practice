import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule
  ]
})
export class UserDialogComponent implements OnInit {
  form: FormGroup;
  roles$: Observable<RoleInfo[]>;

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
      role: [data?.role || '', Validators.required],
      password: ['', data ? [] : Validators.required]
    });
  }

  ngOnInit() { }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      if (this.data) {
        // If editing, don't send password if it's empty
        if (!formData.password) {
          delete formData.password;
        }
      }
      this.dialogRef.close(formData);
    }
  }
}
