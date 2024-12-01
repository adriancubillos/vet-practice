import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
    @IsDate()
    @Type(() => Date)
    dateTime: Date;

    @IsNumber()
    petId: number;

    @IsNumber()
    veterinarianId: number;

    @IsString()
    @IsOptional()
    notes?: string;
}