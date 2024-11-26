import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PetService } from '../../services/pet.service';
import { PetRegistrationRequest } from '../../models/pet.interface';

@Component({
  selector: 'app-pet-registration',
  templateUrl: './pet-registration.component.html',
  styleUrls: ['./pet-registration.component.scss']
})
export class PetRegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  loading = false;

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
      weight: [null]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.loading = true;
      const request: PetRegistrationRequest = this.registrationForm.value;
      
      this.petService.registerPet(request).subscribe({
        next: (response) => {
          this.snackBar.open('Pet registered successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          this.router.navigate(['/pets', response.id]);
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
