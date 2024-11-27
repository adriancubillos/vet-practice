import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PetService } from './pet.service';
import { environment } from '../../../environments/environment';
import { Pet, MedicalRecord } from '../models/pet.interface';

describe('PetService', () => {
  let service: PetService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl.replace('/auth', '')}/pets`;
  const mockToken = 'mock-token';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetService]
    });

    service = TestBed.inject(PetService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(mockToken);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Pet CRUD Operations', () => {
    const mockPet: Pet = {
      id: 1,
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      dateOfBirth: new Date('2018-01-01'),
      gender: 'male',
      weight: 30,
      imageUrl: 'pets/1/image.jpg',
      medicalHistory: [],
      ownerId: 1
    };

    it('should register a new pet', () => {
      const formData = new FormData();
      formData.append('name', 'Max');

      service.registerPet(formData).subscribe(pet => {
        expect(pet).toEqual(mockPet);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(mockPet);
    });

    it('should get all pets', () => {
      const mockPets: Pet[] = [mockPet];

      service.getPets().subscribe(pets => {
        expect(pets).toEqual(mockPets);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(mockPets);
    });

    it('should get all pets (admin)', () => {
      const mockPets: Pet[] = [mockPet];

      service.getAllPets().subscribe(pets => {
        expect(pets).toEqual(mockPets);
      });

      const req = httpMock.expectOne(`${baseUrl}/all`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(mockPets);
    });

    it('should get a pet by id', () => {
      service.getPetById(1).subscribe(pet => {
        expect(pet).toEqual(mockPet);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(mockPet);
    });

    it('should update a pet', () => {
      const formData = new FormData();
      formData.append('name', 'Max Updated');

      service.updatePet(1, formData).subscribe(pet => {
        expect(pet).toEqual(mockPet);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pets/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(mockPet);
    });

    it('should delete a pet', () => {
      service.deletePet(1).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(null);
    });
  });

  describe('Medical Records Operations', () => {
    const mockMedicalRecord: MedicalRecord = {
      id: 1,
      petId: 1,
      date: new Date(),
      description: 'Annual checkup',
      diagnosis: 'Healthy',
      treatment: 'None required',
      notes: 'Regular checkup completed',
      veterinarianId: 1
    };

    it('should add a medical record', () => {
      const record = {
        date: new Date(),
        description: 'Annual checkup',
        diagnosis: 'Healthy',
        treatment: 'None required',
        notes: 'Regular checkup completed',
        veterinarianId: 1
      };

      service.addMedicalRecord(1, record).subscribe(response => {
        expect(response).toEqual(mockMedicalRecord);
      });

      const req = httpMock.expectOne(`${baseUrl}/1/medical-records`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(mockMedicalRecord);
    });

    it('should get medical records', () => {
      const mockRecords = [mockMedicalRecord];

      service.getMedicalRecords(1).subscribe(records => {
        expect(records).toEqual(mockRecords);
      });

      const req = httpMock.expectOne(`${baseUrl}/1/medical-records`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(mockRecords);
    });

    it('should update a medical record', () => {
      const update = { notes: 'Updated notes' };

      service.updateMedicalRecord(1, 1, update).subscribe(response => {
        expect(response).toEqual(mockMedicalRecord);
      });

      const req = httpMock.expectOne(`${baseUrl}/1/medical-records/1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(mockMedicalRecord);
    });

    it('should delete a medical record', () => {
      service.deleteMedicalRecord(1, 1).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/1/medical-records/1`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(null);
    });
  });
});
