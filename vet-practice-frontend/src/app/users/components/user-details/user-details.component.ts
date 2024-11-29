import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  userId: number | null = null;
  user: User | null = null;
  userForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = +id;
      this.loadUser();
    }
  }

  loadUser(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.userForm.patchValue(user);
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error loading user details';
        this.isLoading = false;
        console.error('Error loading user:', error);
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      this.userForm.patchValue(this.user);
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid || !this.userId) return;

    this.isLoading = true;
    this.userService.updateUser(this.userId, this.userForm.value).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.isEditing = false;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error updating user';
        this.isLoading = false;
        console.error('Error updating user:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
