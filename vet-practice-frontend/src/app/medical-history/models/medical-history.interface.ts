export interface MedicalHistory {
  id: number;
  petId: number;
  conditions: string[];
  allergies: string[];
  surgeries: string[];
  medications: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vaccination {
  id: number;
  name: string;
  dateAdministered: Date;
  nextDueDate?: Date;
  administeredBy: {
    id: number;
    firstName: string;
    lastName: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMedicalHistoryDto {
  conditions?: string[];
  allergies?: string[];
  surgeries?: string[];
  medications?: string[];
  notes?: string;
}

export interface CreateVaccinationDto {
  name: string;
  dateAdministered: Date;
  nextDueDate?: Date;
  notes?: string;
}
