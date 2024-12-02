import { IsBoolean, IsDate, IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentStatus } from '../entities/appointment.entity';

export class UpdateAppointmentDto {
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    dateTime?: Date;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsEnum(AppointmentStatus)
    @IsOptional()
    status?: AppointmentStatus;

    @IsString()
    @IsOptional()
    symptoms?: string;

    @IsString()
    @IsOptional()
    diagnosis?: string;

    @IsString()
    @IsOptional()
    treatment?: string;

    @IsString()
    @IsOptional()
    prescriptions?: string;

    @IsNumber()
    @IsOptional()
    weight?: number;

    @IsObject()
    @IsOptional()
    vitals?: {
        temperature?: number;
        heartRate?: number;
        respiratoryRate?: number;
        bloodPressure?: string;
    };

    @IsBoolean()
    @IsOptional()
    followUpNeeded?: boolean;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    followUpDate?: Date;
}