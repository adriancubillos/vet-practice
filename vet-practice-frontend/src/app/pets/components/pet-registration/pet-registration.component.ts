import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PetService } from '../../services/pet.service';
import { PetRegistrationRequest } from '../../models/pet.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-pet-registration',
  templateUrl: './pet-registration.component.html',
  styleUrls: ['./pet-registration.component.scss']
})
export class PetRegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  loading = false;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required]],
      species: ['', [Validators.required]],
      breed: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      weight: [null],
      image: [null]
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Update form control
      this.registrationForm.patchValue({ image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.registrationForm.patchValue({ image: null });
    this.imagePreview = null;
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.loading = true;
      const formData = new FormData();
      const formValue = this.registrationForm.value;

      // Append all form fields to FormData
      Object.keys(formValue).forEach(key => {
        if (key === 'image' && formValue[key]) {
          formData.append('image', formValue[key]);
        } else if (formValue[key] !== null) {
          formData.append(key, formValue[key]);
        }
      });
      
      this.petService.registerPet(formData).subscribe({
        next: (response) => {
          this.snackBar.open('Pet registered successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          this.router.navigate([environment.routes.pet, response.id]);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open(error.error?.message || 'Failed to register pet', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}
