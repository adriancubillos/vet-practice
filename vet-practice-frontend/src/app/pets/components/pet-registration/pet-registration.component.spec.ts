import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PetRegistrationComponent } from './pet-registration.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PetService } from '../../services/pet.service';
import { of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Pet } from '../../models/pet.interface';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('PetRegistrationComponent', () => {
  let component: PetRegistrationComponent;
  let fixture: ComponentFixture<PetRegistrationComponent>;
  let petService: jasmine.SpyObj<PetService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const mockPetResponse: Pet = {
    id: 123,
    name: 'Test Pet',
    species: 'Dog',
    breed: 'Labrador',
    dateOfBirth: new Date('2020-01-01'),
    gender: 'male',
    weight: 20,
    ownerId: 1
  };

  beforeEach(async () => {
    const petServiceSpy = jasmine.createSpyObj('PetService', ['registerPet']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
      ],
      declarations: [ PetRegistrationComponent ],
      providers: [
        FormBuilder,
        { provide: PetService, useValue: petServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    petService = TestBed.inject(PetService) as jasmine.SpyObj<PetService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PetRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty form', () => {
    expect(component.registrationForm.get('name')?.value).toBe('');
    expect(component.registrationForm.get('species')?.value).toBe('');
    expect(component.registrationForm.get('breed')?.value).toBe('');
    expect(component.registrationForm.get('dateOfBirth')?.value).toBe('');
    expect(component.registrationForm.get('gender')?.value).toBe('');
    expect(component.registrationForm.get('weight')?.value).toBeNull();
    expect(component.registrationForm.get('image')?.value).toBeNull();
  });

  it('should mark form as invalid when required fields are empty', () => {
    expect(component.registrationForm.valid).toBeFalse();
  });

  it('should mark form as valid when all required fields are filled', () => {
    component.registrationForm.patchValue({
      name: 'Test Pet',
      species: 'Dog',
      breed: 'Labrador',
      dateOfBirth: new Date('2020-01-01'),
      gender: 'male'
    });

    expect(component.registrationForm.valid).toBeTrue();
  });

  it('should handle file selection', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [file] } } as unknown as Event;

    component.onFileSelected(event);

    expect(component.registrationForm.get('image')?.value).toBe(file);
  });

  it('should remove image', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    component.registrationForm.patchValue({ image: file });
    component.imagePreview = 'test-preview';

    component.removeImage();

    expect(component.registrationForm.get('image')?.value).toBeNull();
    expect(component.imagePreview).toBeNull();
  });

  it('should successfully submit form and navigate', fakeAsync(() => {
    component.registrationForm.patchValue({
      name: 'Test Pet',
      species: 'Dog',
      breed: 'Labrador',
      dateOfBirth: new Date('2020-01-01'),
      gender: 'male',
    });

    petService.registerPet.and.returnValue(of(mockPetResponse));

    component.onSubmit();
    tick();

    expect(petService.registerPet).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith(
      'Pet registered successfully!',
      'Close',
      jasmine.any(Object)
    );
    expect(router.navigate).toHaveBeenCalledWith([environment.routes.pet, mockPetResponse.id]);
    expect(component.loading).toBeFalse();
  }));

  it('should handle submission error', fakeAsync(() => {
    component.registrationForm.patchValue({
      name: 'Test Pet',
      species: 'Dog',
      breed: 'Labrador',
      dateOfBirth: new Date('2020-01-01'),
      gender: 'male'
    });

    const error = { error: { message: 'Registration failed' } };
    petService.registerPet.and.returnValue(throwError(() => error));

    component.onSubmit();
    tick();

    expect(petService.registerPet).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith(
      'Registration failed',
      'Close',
      jasmine.any(Object)
    );
    expect(component.loading).toBeFalse();
  }));
});
