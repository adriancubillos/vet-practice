import { IsString, IsEnum, IsDate, IsNumber, IsOptional } from 'class-validator';
import { Gender } from '../entities/pet.entity';

export class CreatePetDto {
  @IsString()
  name: string;

  @IsString()
  species: string;

  @IsString()
  breed: string;

  @IsDate()
  dateOfBirth: Date;

  @IsEnum(Gender)
  gender: Gender;

  @IsNumber()
  @IsOptional()
  weight?: number;
}