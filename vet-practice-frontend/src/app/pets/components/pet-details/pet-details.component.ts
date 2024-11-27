import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pet-details',
  templateUrl: './pet-details.component.html',
  styleUrls: ['./pet-details.component.scss']
})
export class PetDetailsComponent implements OnInit {
  pet: Pet | null = null;
  isEditing = false;
  petForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.petForm = this.fb.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      breed: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      weight: [null],
    });
  }

  ngOnInit(): void {
    const petId = this.route.snapshot.paramMap.get('id');
    if (petId) {
      this.loadPetDetails(+petId);
    }
  }

  loadPetDetails(id: number): void {
    this.petService.getPetById(id).subscribe({
      next: (pet) => {
        this.pet = pet;
        this.petForm.patchValue({
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          dateOfBirth: pet.dateOfBirth,
          gender: pet.gender,
          weight: pet.weight
        });
      },
      error: (error) => {
        this.snackBar.open('Error loading pet details', 'Close', { duration: 3000 });
        console.error('Error loading pet:', error);
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.pet) {
      this.petForm.patchValue(this.pet);
    }
  }

  savePet(): void {
    if (this.petForm.valid && this.pet?.id) {
      const updatedPet = {
        ...this.petForm.value,
        id: this.pet.id,
        ownerId: this.pet.ownerId
      };

      this.petService.updatePet(this.pet.id, updatedPet).subscribe({
        next: (pet) => {
          this.pet = pet;
          this.isEditing = false;
          this.snackBar.open('Pet details updated successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Error updating pet details', 'Close', { duration: 3000 });
          console.error('Error updating pet:', error);
        }
      });
    }
  }

  deletePet(): void {
    if (this.pet?.id && confirm('Are you sure you want to delete this pet?')) {
      this.petService.deletePet(this.pet.id).subscribe({
        next: () => {
          this.snackBar.open('Pet deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/pets']);
        },
        error: (error) => {
          this.snackBar.open('Error deleting pet', 'Close', { duration: 3000 });
          console.error('Error deleting pet:', error);
        }
      });
    }
  }
}
