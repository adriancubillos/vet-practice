import { Component, OnInit } from '@angular/core';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-pet-list',
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.scss']
})
export class PetListComponent implements OnInit {
  pets: Pet[] = [];
  loading = false;
  error: string | null = null;

  // Base64 encoded placeholder image
    placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWUiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4NSIgcj0iMzUiIGZpbGw9IiNhYWEiLz4KICA8Y2lyY2xlIGN4PSI2NSIgY3k9IjEyNSIgcj0iMjAiIGZpbGw9IiNhYWEiLz4KICA8Y2lyY2xlIGN4PSIxMzUiIGN5PSIxMjUiIHI9IjIwIiBmaWxsPSIjYWFhIi8+CiAgPHBhdGggZD0iTTY1LDE1MCBRMTAwLDE4MCAxMzUsMTUwIiBzdHJva2U9IiNhYWEiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=';
  constructor(private petService: PetService) {}

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.loading = true;
    this.error = null;
    this.petService.getPets().subscribe({
      next: (pets) => {
        this.pets = pets;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pets:', error);
        this.error = 'Failed to load pets. Please try again later.';
        this.loading = false;
      }
    });
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) {
      return this.placeholderImage;
      //return 'assets/images/pet-placeholder.jpg';
    }
    // Remove any leading slashes from the imageUrl to prevent double slashes
    const cleanImageUrl = imageUrl.replace(/^\/+/, '');
    return imageUrl.startsWith('http') ? imageUrl : `${environment.apiUrl}/${cleanImageUrl}`;
  }

  getAgeInYears(dateOfBirth: Date): number {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.placeholderImage;
  }
}
