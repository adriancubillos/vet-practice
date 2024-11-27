import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PetDetailsComponent } from './pet-details.component';
import { PetService } from '../../services/pet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Pet } from '../../models/pet.interface';

describe('PetDetailsComponent', () => {
  let component: PetDetailsComponent;
  let fixture: ComponentFixture<PetDetailsComponent>;
  let petService: jasmine.SpyObj<PetService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let router: jasmine.SpyObj<Router>;

  const mockPet: Pet = {
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
  };

  beforeEach(async () => {
    const petServiceSpy = jasmine.createSpyObj('PetService', ['getPetById', 'updatePet', 'deletePet']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatIconModule
      ],
      declarations: [ PetDetailsComponent ],
      providers: [
        FormBuilder,
        { provide: PetService, useValue: petServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    petService = TestBed.inject(PetService) as jasmine.SpyObj<PetService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PetDetailsComponent);
    component = fixture.componentInstance;
    petService.getPetById.and.returnValue(of(mockPet));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadPetDetails', () => {
    it('should load pet details successfully', fakeAsync(() => {
      component.loadPetDetails(1);
      tick();

      expect(component.pet).toEqual(mockPet);
      expect(component.petForm.value).toEqual({
        name: mockPet.name,
        species: mockPet.species,
        breed: mockPet.breed,
        dateOfBirth: mockPet.dateOfBirth,
        gender: mockPet.gender,
        weight: mockPet.weight,
        image: null
      });
    }));

    it('should handle error when loading pet details', fakeAsync(() => {
      const error = new Error('Failed to load');
      petService.getPetById.and.returnValue(throwError(() => error));
      spyOn(console, 'error'); // Prevent error from showing in test output

      component.loadPetDetails(1);
      tick();

      expect(snackBar.open).toHaveBeenCalledWith(
        'Error loading pet details',
        'Close',
        { duration: 3000 }
      );
      expect(console.error).toHaveBeenCalledWith('Error loading pet:', error);
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

  describe('onFileSelected', () => {
    it('should handle file selection', fakeAsync(() => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const event = {
        target: {
          files: [file]
        }
      } as unknown as Event;

      component.onFileSelected(event);
      tick();

      expect(component.selectedFile).toBe(file);
      expect(component.petForm.get('image')?.value).toBe(file);
    }));
  });

  describe('removeImage', () => {
    it('should clear image data', () => {
      component.pet = { ...mockPet };
      component.imagePreview = 'test-preview';
      component.selectedFile = new File(['test'], 'test.jpg');
      component.imageExists = true;

      component.removeImage();

      expect(component.imagePreview).toBeNull();
      expect(component.selectedFile).toBeNull();
      expect(component.petForm.get('image')?.value).toBeNull();
      expect(component.pet.imageUrl).toBeUndefined();
      expect(component.imageExists).toBeFalse();
    });
  });

  describe('toggleEdit', () => {
    it('should toggle edit mode and reset form', () => {
      component.pet = mockPet;
      component.imagePreview = 'test-preview';
      component.selectedFile = new File(['test'], 'test.jpg');
      component.isEditing = false;

      component.toggleEdit();

      expect(component.isEditing).toBeTrue();

      component.toggleEdit();

      expect(component.isEditing).toBeFalse();
      expect(component.imagePreview).toBeNull();
      expect(component.selectedFile).toBeNull();
      expect(component.petForm.value).toEqual({
        name: mockPet.name,
        species: mockPet.species,
        breed: mockPet.breed,
        dateOfBirth: mockPet.dateOfBirth,
        gender: mockPet.gender,
        weight: mockPet.weight,
        image: null
      });
    });
  });

  describe('savePet', () => {
    it('should update pet successfully', fakeAsync(() => {
      component.pet = mockPet;
      const updatedPet: Pet = { 
        ...mockPet, 
        name: 'Updated Max',
        gender: 'male' as 'male'
      };
      petService.updatePet.and.returnValue(of(updatedPet));

      component.petForm.patchValue({ name: 'Updated Max' });
      component.savePet();
      tick();

      expect(petService.updatePet).toHaveBeenCalled();
      expect(component.pet).toEqual(updatedPet);
      expect(component.isEditing).toBeFalse();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Pet details updated successfully',
        'Close',
        { duration: 3000 }
      );
    }));

    it('should handle error when updating pet', fakeAsync(() => {
      component.pet = mockPet;
      const error = new Error('Failed to update');
      petService.updatePet.and.returnValue(throwError(() => error));
      spyOn(console, 'error'); // Prevent error from showing in test output

      component.petForm.patchValue({ name: 'Updated Max' });
      component.savePet();
      tick();

      expect(snackBar.open).toHaveBeenCalledWith(
        'Error updating pet details',
        'Close',
        { duration: 3000 }
      );
      expect(console.error).toHaveBeenCalledWith('Error updating pet:', error);
    }));
  });

  describe('deletePet', () => {
    it('should delete pet successfully', fakeAsync(() => {
      component.pet = mockPet;
      dialog.open.and.returnValue({
        afterClosed: () => of(true)
      } as any);
      petService.deletePet.and.returnValue(of(void 0));

      component.deletePet();
      tick();

      expect(petService.deletePet).toHaveBeenCalledWith(1);
      expect(router.navigate).toHaveBeenCalledWith(['/pets']);
      expect(snackBar.open).toHaveBeenCalledWith(
        'Pet deleted successfully',
        'Close',
        { duration: 3000 }
      );
    }));

    it('should handle error when deleting pet', fakeAsync(() => {
      component.pet = mockPet;
      const error = new Error('Failed to delete');
      dialog.open.and.returnValue({
        afterClosed: () => of(true)
      } as any);
      petService.deletePet.and.returnValue(throwError(() => error));
      const consoleSpy = spyOn(console, 'error'); // Prevent error from showing in test output

      component.deletePet();
      tick();

      expect(snackBar.open).toHaveBeenCalledWith(
        'Error deleting pet',
        'Close',
        { duration: 3000 }
      );
      expect(consoleSpy).toHaveBeenCalledWith('Error deleting pet:', error);
    }));

    it('should not delete pet when dialog is cancelled', fakeAsync(() => {
      component.pet = mockPet;
      dialog.open.and.returnValue({
        afterClosed: () => of(false)
      } as any);

      component.deletePet();
      tick();

      expect(petService.deletePet).not.toHaveBeenCalled();
    }));
  });

  describe('hasActualImage', () => {
    it('should return true when image exists', () => {
      component.imageExists = true;
      expect(component.hasActualImage()).toBeTrue();
    });

    it('should return true when image preview exists', () => {
      component.imagePreview = 'test-preview';
      expect(component.hasActualImage()).toBeTrue();
    });

    it('should return false when no image exists', () => {
      component.imageExists = false;
      component.imagePreview = null;
      expect(component.hasActualImage()).toBeFalse();
    });
  });
});
