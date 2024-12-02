import { IsString, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVaccinationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @Type(() => Date)
    @IsDate()
    dateAdministered: Date;

    @ApiProperty()
    @Type(() => Date)
    @IsDate()
    nextDueDate: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    batchNumber: string;
}
