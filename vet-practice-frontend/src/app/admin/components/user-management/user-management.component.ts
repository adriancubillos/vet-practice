import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UserService, User } from '../../services/user.service';
import { RoleService, RoleInfo } from '../../../auth/services/role.service';
import { Observable } from 'rxjs';
import { UserDialogComponent } from "../user-dialog/user-dialog.component";


@Component({
  selector: 'app-user-management',
  template: `
    <div class="container">
      <h1>User Management</h1>
      
      <div class="actions">
        <button mat-raised-button color="primary" (click)="openUserDialog()">
          <mat-icon>add</mat-icon>
          Add User
        </button>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <mat-table [dataSource]="users" class="mat-elevation-z8">
        <ng-container matColumnDef="username">
          <mat-header-cell *matHeaderCellDef>Username</mat-header-cell>
          <mat-cell *matCellDef="let user">{{user.username}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="email">
          <mat-header-cell *matHeaderCellDef>Email</mat-header-cell>
          <mat-cell *matCellDef="let user">{{user.email}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="role">
          <mat-header-cell *matHeaderCellDef>Role</mat-header-cell>
          <mat-cell *matCellDef="let user">{{user.role}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
          <mat-cell *matCellDef="let user">
            <button mat-icon-button color="primary" (click)="openUserDialog(user)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteUser(user)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
      </mat-table>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .actions {
      margin-bottom: 20px;
    }
    .loading-spinner {
      display: flex;
      justify-content: center;
      margin: 20px 0;
    }
    .mat-column-actions {
      width: 100px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  displayedColumns = ['username', 'email', 'role', 'actions'];
  loading = true;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  openUserDialog(user?: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user) {
          this.updateUser(user.id, result);
        } else {
          this.createUser(result);
        }
      }
    });
  }

  createUser(userData: Partial<User>) {
    this.userService.createUser(userData).subscribe({
      next: () => {
        this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
        this.loadUsers();
      },
      error: (error) => {
        this.snackBar.open('Error creating user', 'Close', { duration: 3000 });
      }
    });
  }

  updateUser(id: number, userData: Partial<User>) {
    this.userService.updateUser(id, userData).subscribe({
      next: () => {
        this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
        this.loadUsers();
      },
      error: (error) => {
        this.snackBar.open('Error updating user', 'Close', { duration: 3000 });
      }
    });
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          this.loadUsers();
        },
        error: (error) => {
          this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
