export interface Appointment {
  id?: number;
  petId: number;
  ownerId: number;
  veterinarianId: number;
  appointmentDate: Date;
  duration: number; // in minutes
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  createdAt: Date;                // Date the appointment was created
  updatedAt: Date;                // Date the appointment was last updated
}

export type AppointmentStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
