import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Pet } from '../../models/pet.interface';
import { environment } from '../../../../environments/environment';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

// Material Imports
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.scss']
})
export class PetListComponent implements OnInit {
  pets: Pet[] = [];
  myPetsCount = 0;
  loading = false;
  error: string | null = null;
  selectedView = 'all';
  isVetOrAdmin$: Observable<boolean>;

  // Base64 encoded placeholder image
  placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWUiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4NSIgcj0iMzUiIGZpbGw9IiNhYWEiLz4KICA8Y2lyY2xlIGN4PSI2NSIgY3k9IjEyNSIgcj0iMjAiIGZpbGw9IiNhYWEiLz4KICA8Y2lyY2xlIGN4PSIxMzUiIGN5PSIxMjUiIHI9IjIwIiBmaWxsPSIjYWFhIi8+CiAgPHBhdGggZD0iTTY1LDE1MCBRMTAwLDE4MCAxMzUsMTUwIiBzdHJva2U9IiNhYWEiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=';

  constructor(
    private petService: PetService,
    private authService: AuthService
  ) {
    this.isVetOrAdmin$ = this.authService.user$.pipe(
      map(user => user?.role === 'vet' || user?.role === 'admin')
    );
  }

  ngOnInit(): void {
    // Get initial count of personal pets
    this.petService.getMyPets().subscribe(pets => {
      this.myPetsCount = pets.length;
    });

    // Setup view switching based on role and selected view
    combineLatest([
      this.isVetOrAdmin$,
      this.authService.user$
    ]).pipe(
      switchMap(([isVetOrAdmin]) => {
        this.loading = true;
        return isVetOrAdmin && this.selectedView === 'all' 
          ? this.petService.getAllPets()
          : this.petService.getMyPets();
      })
    ).subscribe({
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

  onViewChange(view: string): void {
    this.selectedView = view;
    this.loadPets();
  }

  loadPets(): void {
    this.loading = true;
    this.error = null;
    
    const request$ = this.selectedView === 'all' 
      ? this.petService.getAllPets()
      : this.petService.getMyPets();

    request$.subscribe({
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
    }
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
