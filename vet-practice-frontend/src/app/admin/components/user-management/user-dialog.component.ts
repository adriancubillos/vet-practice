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
  template: `
    <h2 mat-dialog-title>{{data ? 'Edit' : 'Add'}} User</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" required>
            <mat-error *ngIf="form.get('username')?.hasError('required')">
              Username is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" required>
            <mat-error *ngIf="form.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="form.get('email')?.hasError('email')">
              Please enter a valid email
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Role</mat-label>
            <mat-select formControlName="role" required>
              <mat-option *ngFor="let role of roles$ | async" [value]="role.value">
                {{role.label}}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('role')?.hasError('required')">
              Role is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row" *ngIf="!data">
          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" type="password" required>
            <mat-error *ngIf="form.get('password')?.hasError('required')">
              Password is required
            </mat-error>
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">
          {{data ? 'Update' : 'Create'}}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .form-row {
      margin-bottom: 16px;
    }
    mat-form-field {
      width: 100%;
    }
  `],
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

  ngOnInit() {}

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
