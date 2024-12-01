export class UpdateMedicalHistoryDto {
    allergies?: string[];
    chronicConditions?: string[];
    specialNotes?: string;
    vaccinations?: {
        name: string;
        dateAdministered: Date;
        nextDueDate: Date;
        batchNumber: string;
    }[];
}