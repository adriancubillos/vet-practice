export interface Appointment {
  id?: number;
  pet: {
    id: number;
    name: string;
    owner: {
      id: number;
      firstName: string;
      lastName: string;
    };
  };
  veterinarian: {
    id: number;
    firstName: string;
    lastName: string;
  };
  dateTime: Date;
  status: AppointmentStatus;
  reason: string;
  duration: number;
  notes?: string;
  diagnosis?: string;
  treatment?: string;
  prescriptions?: string;
  vitals?: string;
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}
