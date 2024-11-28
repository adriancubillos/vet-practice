import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

// Material Imports
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';

import { environment } from '../../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { RoleService, RoleInfo } from '../../services/role.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSelectModule
  ]
})
export class RegisterComponent implements OnInit {
  accountFormGroup!: FormGroup;
  personalFormGroup!: FormGroup;
  contactFormGroup!: FormGroup;
  hidePassword = true;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  roles$: Observable<RoleInfo[]>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private roleService: RoleService,
    private router: Router
  ) {
    this.loading$ = this.authService.loading$;
    this.error$ = this.authService.error$;
    this.roles$ = this.roleService.getRoles();
  }

  ngOnInit() {
    this.initializeForms();
  }

  private initializeForms() {
    // Account Information Form
    this.accountFormGroup = this.fb.group({
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
        Validators.minLength(8),
        Validators.maxLength(32),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });

    // Personal Information Form
    this.personalFormGroup = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]]
    });

    // Contact Information Form
    this.contactFormGroup = this.fb.group({
      address: ['', [
        Validators.maxLength(200)
      ]],
      phoneNumber: ['', [
        Validators.pattern(/^\+?[1-9]\d{1,14}$/)
      ]]
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  getErrorMessage(field: string, formGroup: FormGroup): string {
    const control = formGroup.get(field);
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
        return 'Password must be at least 8 characters';
      }
      if (control.hasError('pattern')) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
      }
    }

    if (field === 'confirmPassword' && formGroup.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }

    if (field === 'role' && control.hasError('required')) {
      return 'Please select a role';
    }

    return '';
  }

  onSubmit() {
    if (this.accountFormGroup.valid && 
        this.personalFormGroup.valid && 
        this.contactFormGroup.valid) {
      const registerData = {
        ...this.accountFormGroup.value,
        ...this.personalFormGroup.value,
        ...this.contactFormGroup.value
      };
      delete registerData.confirmPassword;
      
      this.authService.register(registerData).subscribe({
        next: () => {
          this.router.navigate([environment.routes.auth.login]);
        },
        error: (error) => {
          console.error('Registration error:', error);
        }
      });
    }
  }

  navigateToLogin(): void {
    this.router.navigate([environment.routes.auth.login]);
  }
}
