import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { VaccinationDto } from './vaccination.dto';

export class UpdateMedicalHistoryDto {
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    allergies?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    chronicConditions?: string[];

    @IsString()
    @IsOptional()
    specialNotes?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VaccinationDto)
    @IsOptional()
    vaccinations?: VaccinationDto[];
}