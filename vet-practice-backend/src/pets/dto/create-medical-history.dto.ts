import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicalHistoryDto {
    @ApiProperty({ required: false })
    @IsArray()
    @IsOptional()
    allergies?: string[];

    @ApiProperty({ required: false })
    @IsArray()
    @IsOptional()
    chronicConditions?: string[];

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    specialNotes?: string;
}
