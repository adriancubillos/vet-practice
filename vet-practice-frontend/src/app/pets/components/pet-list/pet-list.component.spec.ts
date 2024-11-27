import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PetListComponent } from './pet-list.component';
import { PetService } from '../../services/pet.service';
import { of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Pet } from '../../models/pet.interface';

describe('PetListComponent', () => {
  let component: PetListComponent;
  let fixture: ComponentFixture<PetListComponent>;
  let petService: jasmine.SpyObj<PetService>;

  const mockPets: Pet[] = [
    {
      id: 1,
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      dateOfBirth: new Date('2018-01-01'),
      gender: 'male' as 'male',
      weight: 30,
      imageUrl: 'pets/1/image.jpg',
      medicalHistory: [],
      ownerId: 1
    },
    {
      id: 2,
      name: 'Luna',
      species: 'Cat',
      breed: 'Siamese',
      dateOfBirth: new Date('2020-01-01'),
      gender: 'female' as 'female',
      weight: 4,
      imageUrl: 'https://example.com/cat.jpg',
      medicalHistory: [],
      ownerId: 1
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PetService', ['getPets']);
    spy.getPets.and.returnValue(of(mockPets));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatCardModule,
        MatIconModule
      ],
      declarations: [ PetListComponent ],
      providers: [
        { provide: PetService, useValue: spy }
      ]
    })
    .compileComponents();

    petService = TestBed.inject(PetService) as jasmine.SpyObj<PetService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PetListComponent);
    component = fixture.componentInstance;
    // Reset component state before each test
    component.pets = [];
    component.loading = false;
    component.error = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadPets', () => {
    it('should load pets successfully', fakeAsync(() => {
      petService.getPets.and.returnValue(of(mockPets));
      component.loadPets();
      tick();

      expect(component.pets).toEqual(mockPets);
      expect(component.loading).toBeFalse();
      expect(component.error).toBeNull();
    }));

    it('should handle error when loading pets', fakeAsync(() => {
      const error = new Error('Failed to load');
      petService.getPets.and.returnValue(throwError(() => error));
      spyOn(console, 'error'); // Prevent error from showing in test output

      component.loadPets();
      tick();

      expect(console.error).toHaveBeenCalledWith('Error loading pets:', error);
      expect(component.loading).toBeFalse();
      expect(component.error).toBe('Failed to load pets. Please try again later.');
      expect(component.pets).toEqual([]);
    }));
  });

  describe('getImageUrl', () => {
    it('should return placeholder image when imageUrl is undefined', () => {
      const result = component.getImageUrl(undefined);
      expect(result).toBe(component.placeholderImage);
    });

    it('should return full URL for relative path', () => {
      const imageUrl = 'pets/1/image.jpg';
      const result = component.getImageUrl(imageUrl);
      expect(result).toBe(`${environment.apiUrl}/${imageUrl}`);
    });

    it('should return original URL for absolute URLs', () => {
      const imageUrl = 'https://example.com/image.jpg';
      const result = component.getImageUrl(imageUrl);
      expect(result).toBe(imageUrl);
    });
  });

  describe('getAgeInYears', () => {
    it('should calculate age correctly', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 5); // 5 years ago
      const age = component.getAgeInYears(birthDate);
      expect(age).toBe(5);
    });
  });
});
