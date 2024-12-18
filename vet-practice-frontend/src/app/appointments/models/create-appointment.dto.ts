import { AppointmentReason } from './appointment-reason.enum';

export interface CreateAppointmentDto {
    dateTime: Date;
    petId: number;
    veterinarianId: number;
    reason: AppointmentReason;
    duration: number;
    notes?: string;
}
