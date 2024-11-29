import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../models/user.interface';
import { UserService } from '../../services/user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  error: string | null = null;
  avatarColors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', 
    '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
    '#009688', '#4CAF50', '#8BC34A', '#CDDC39'
  ];

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load users. Please try again later.';
        this.isLoading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  getInitials(user: User): string {
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  }

  getAvatarColor(user: User): string {
    const nameHash = this.getFullName(user)
      .split('')
      .reduce((hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0);
    return this.avatarColors[Math.abs(nameHash) % this.avatarColors.length];
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'admin_panel_settings';
      case 'VET':
        return 'medical_services';
      case 'CLIENT':
        return 'person';
      default:
        return 'person_outline';
    }
  }

  addUser(): void {
    this.router.navigate(['/admin/users/new']);
  }

  editUser(user: User): void {
    if (user.id === undefined) {
      console.error('Cannot edit user without id');
      this.error = 'Cannot edit this user. Missing ID.';
      return;
    }
    this.router.navigate(['/admin/users/edit', user.id]);
  }

  deleteUser(user: User): void {
    if (user.id === undefined) {
      console.error('Cannot delete user without id');
      this.error = 'Cannot delete this user. Missing ID.';
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${this.getFullName(user)}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers(); // Reload the list after deletion
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.error = 'Failed to delete user. Please try again later.';
        }
      });
    }
  }
}
