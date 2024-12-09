import { IsDate, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentReason } from '../enums/appointment-reason.enum';

export class CreateAppointmentDto {
    @IsDate()
    @Type(() => Date)
    dateTime: Date;

    @IsNumber()
    @Type(() => Number)
    petId: number;

    @IsNumber()
    @Type(() => Number)
    veterinarianId: number;

    @IsEnum(AppointmentReason)
    reason: AppointmentReason;

    @IsNumber()
    @Type(() => Number)
    duration: number;

    @IsString()
    @IsOptional()
    notes?: string;
}