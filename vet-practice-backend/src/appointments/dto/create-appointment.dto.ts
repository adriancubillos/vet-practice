import { IsDate, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentReason } from '../enums/appointment-reason.enum';

export class CreateAppointmentDto {
    @IsDate()
    @Type(() => Date)
    dateTime: Date;

    @IsNumber()
    petId: number;

    @IsNumber()
    veterinarianId: number;

    @IsEnum(AppointmentReason)
    reason: AppointmentReason;

    @IsString()
    @IsOptional()
    notes?: string;
}