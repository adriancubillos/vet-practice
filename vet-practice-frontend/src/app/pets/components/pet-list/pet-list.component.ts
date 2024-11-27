import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="pet-list-container">
      <div class="header">
        <h1>My Pets</h1>
        <button mat-raised-button color="primary" routerLink="register">
          <mat-icon>add</mat-icon>
          Register New Pet
        </button>
      </div>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>

      <div *ngIf="!loading && !error" class="pet-grid">
        <mat-card *ngFor="let pet of pets" class="pet-card" [routerLink]="['/pets', pet.id]">
          <div class="pet-image" [style.backgroundImage]="'url(' + getImageUrl(pet.imageUrl) + ')'"></div>
          <mat-card-content>
            <h2>{{ pet.name }}</h2>
            <p class="breed">{{ pet.species }} - {{ pet.breed }}</p>
            <p class="age">{{ getAgeInYears(pet.dateOfBirth) }} years old</p>
          </mat-card-content>
        </mat-card>

        <div *ngIf="pets.length === 0" class="no-pets">
          <mat-icon>pets</mat-icon>
          <p>You haven't registered any pets yet.</p>
          <button mat-raised-button color="primary" routerLink="register">
            Register Your First Pet
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pet-list-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .pet-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      padding: 16px 0;
    }

    .pet-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      border-radius: 12px;
      overflow: hidden;
      background: white;
    }

    .pet-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    }

    .pet-image {
      height: 200px;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      border-bottom: 1px solid rgba(0,0,0,0.1);
    }

    .pet-card mat-card-content {
      padding: 16px;
    }

    .pet-card h2 {
      margin: 0 0 8px 0;
      font-size: 1.4em;
      color: #333;
    }

    .pet-card .breed {
      margin: 4px 0;
      color: #666;
      font-size: 0.95em;
    }

    .pet-card .age {
      margin: 4px 0;
      color: #888;
      font-size: 0.9em;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
    }

    .error-message {
      color: #f44336;
      text-align: center;
      padding: 20px;
      background: #ffebee;
      border-radius: 8px;
      margin: 20px 0;
    }

    .no-pets {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
      background: #fafafa;
      border-radius: 12px;
      border: 2px dashed #ddd;
    }

    .no-pets mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: #888;
    }

    .no-pets p {
      margin: 0 0 24px 0;
      font-size: 1.2em;
      color: #666;
    }

    button[mat-raised-button] {
      height: 40px;
      padding: 0 24px;
    }

    .header button mat-icon {
      margin-right: 8px;
    }
  `]
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
        this.error = 'Failed to load pets. Please try again.';
        this.loading = false;
        console.error('Error loading pets:', error);
      }
    });
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (imageUrl === undefined || imageUrl === null) {
      return this.placeholderImage;
    }
    // Remove any leading slashes from the imageUrl
    const cleanImageUrl = imageUrl.replace(/^\/+/, '');
    return `${environment.apiUrl}/${cleanImageUrl}`;
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
}
