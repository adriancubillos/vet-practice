import { AppointmentStatus } from "../entities/appointment.entity";

export class UpdateAppointmentDto {
    status?: AppointmentStatus;
    symptoms?: string;
    diagnosis?: string;
    treatment?: string;
    prescriptions?: string;
    weight?: number;
    vitals?: {
        temperature?: number;
        heartRate?: number;
        respiratoryRate?: number;
        bloodPressure?: string;
    };
    followUpNeeded?: boolean;
    followUpDate?: Date;
    notes?: string;
}