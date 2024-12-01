export class MedicalHistoryResponseDto {
    id: number;
    pet: {
        id: number;
        name: string;
    };
    allergies: string[];
    chronicConditions: string[];
    specialNotes: string;
    vaccinations: {
        name: string;
        dateAdministered: Date;
        nextDueDate: Date;
        batchNumber: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}