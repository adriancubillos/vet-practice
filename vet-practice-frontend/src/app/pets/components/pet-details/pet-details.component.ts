import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-pet-details',
  templateUrl: './pet-details.component.html',
  styleUrls: ['./pet-details.component.scss']
})
export class PetDetailsComponent implements OnInit {
  pet: Pet | null = null;
  isEditing = false;
  petForm: FormGroup;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWUiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4NSIgcj0iMzUiIGZpbGw9IiNhYWEiLz4KICA8Y2lyY2xlIGN4PSI2NSIgY3k9IjEyNSIgcj0iMjAiIGZpbGw9IiNhYWEiLz4KICA8Y2lyY2xlIGN4PSIxMzUiIGN5PSIxMjUiIHI9IjIwIiBmaWxsPSIjYWFhIi8+CiAgPHBhdGggZD0iTTY1LDE1MCBRMTAwLDE4MCAxMzUsMTUwIiBzdHJva2U9IiNhYWEiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=';
  imageExists = false;

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
      image: [null]
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
        // Check if image exists when loading pet details
        if (pet.imageUrl && !pet.imageUrl.startsWith('data:image/svg+xml;base64,')) {
          this.checkImageExists(pet.imageUrl);
        }
      },
      error: (error) => {
        this.snackBar.open('Error loading pet details', 'Close', { duration: 3000 });
        console.error('Error loading pet:', error);
      }
    });
  }

  checkImageExists(url: string): void {
    const img = new Image();
    img.onload = () => {
      this.imageExists = true;
    };
    img.onerror = () => {
      this.imageExists = false;
      if (this.pet) {
        this.pet.imageUrl = undefined;
      }
    };
    img.src = this.getImageUrl(url);
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) {
      return this.placeholderImage;
    }
    const cleanImageUrl = imageUrl.replace(/^\/+/, '');
    return imageUrl.startsWith('http') ? imageUrl : `${environment.apiUrl}/${cleanImageUrl}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.placeholderImage;
    this.imageExists = false;
    if (this.pet) {
      this.pet.imageUrl = undefined;
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Update form control
      this.petForm.patchValue({ image: file });
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;
    this.petForm.patchValue({ image: null });
    if (this.pet) {
      this.pet.imageUrl = undefined;
    }
    this.imageExists = false;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.pet) {
      this.petForm.patchValue(this.pet);
      this.imagePreview = null;
      this.selectedFile = null;
    }
  }

  savePet(): void {
    if (this.petForm.valid && this.pet?.id) {
      const formData = new FormData();
      const updatedPet = {
        ...this.petForm.value
      };
      delete updatedPet.image; // Remove image from pet object

      // Add each pet field to FormData individually
      Object.entries(updatedPet).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // Handle Date objects
          if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      // Add image if selected
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.petService.updatePet(this.pet.id, formData).subscribe({
        next: (pet) => {
          this.pet = pet;
          this.isEditing = false;
          this.imagePreview = null;
          this.selectedFile = null;
          if (pet.imageUrl) {
            this.checkImageExists(pet.imageUrl);
          }
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

  hasActualImage(): boolean {
    return this.imageExists || this.imagePreview !== null;
  }
}
