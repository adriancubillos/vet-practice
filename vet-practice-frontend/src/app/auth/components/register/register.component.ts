import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { register } from '../../store/auth.actions';
import { AuthState } from '../../models/auth.interface';

// Material Imports
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule
  ]
})
export class RegisterComponent implements OnInit {
  accountFormGroup!: FormGroup;
  personalFormGroup!: FormGroup;
  contactFormGroup!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: AuthState }>
  ) {
    this.loading$ = this.store.select(state => state.auth.loading);
    this.error$ = this.store.select(state => state.auth.error);
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
      confirmPassword: ['', Validators.required]
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
      : { mismatch: true };
  }

  getErrorMessage(controlName: string, formGroup: FormGroup): string {
    const control = formGroup.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Minimum length is ${minLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Maximum length is ${maxLength} characters`;
    }
    if (control?.hasError('pattern')) {
      if (controlName === 'password') {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
      }
      if (controlName === 'phoneNumber') {
        return 'Please enter a valid phone number';
      }
    }
    if (formGroup.hasError('mismatch') && controlName === 'confirmPassword') {
      return 'Passwords do not match';
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
      
      this.store.dispatch(register({ request: registerData }));
    }
  }
}
