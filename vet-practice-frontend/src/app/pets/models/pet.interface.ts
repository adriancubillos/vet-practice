export interface Pet {
  id?: number;
  name: string;
  species: string;
  breed: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  ownerId: number;
  weight?: number;
  imageUrl?: string;
  medicalHistory?: MedicalRecord[];
}

export interface MedicalRecord {
  id?: number;
  petId: number;
  date: Date;
  diagnosis: string;
  treatment: string;
  notes?: string;
  veterinarianId: number;
  followUpDate?: Date;
}

export interface PetRegistrationRequest {
  name: string;
  species: string;
  breed: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  weight?: number;
  image?: File;
}

export interface PetState {
  pets: Pet[];
  selectedPet: Pet | null;
  loading: boolean;
  error: string | null;
}
