import { AppointmentStatus } from '../entities/appointment.entity';

export class AppointmentResponseDto {
    id: number;
    dateTime: Date;
    status: AppointmentStatus;
    
    pet: {
        id: number;
        name: string;
    };
    
    owner: {
        id: number;
        firstName: string;
        lastName: string;
    };
    
    veterinarian: {
        id: number;
        firstName: string;
        lastName: string;
    };
    
    medicalDetails?: {
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
    };
    
    followUpNeeded?: boolean;
    followUpDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}