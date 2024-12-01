import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class VaccinationDto {
    @IsString()
    name: string;

    @IsDate()
    @Type(() => Date)
    dateAdministered: Date;

    @IsDate()
    @Type(() => Date)
    nextDueDate: Date;

    @IsString()
    batchNumber: string;
}

export class VaccinationResponseDto {
    id: number;
    name: string;
    dateAdministered: Date;
    nextDueDate: Date;
    batchNumber: string;
    createdAt: Date;
    updatedAt: Date;
}
