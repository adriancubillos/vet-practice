import { VaccinationResponseDto } from './vaccination.dto';

export class MedicalHistoryResponseDto {
    id: number;
    
    pet: {
        id: number;
        name: string;
    };
    
    allergies: string[];
    chronicConditions: string[];
    specialNotes: string;
    
    vaccinations: VaccinationResponseDto[];
    
    createdAt: Date;
    updatedAt: Date;
}