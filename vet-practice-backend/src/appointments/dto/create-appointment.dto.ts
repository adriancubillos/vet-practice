export class CreateAppointmentDto {
    dateTime: Date;
    petId: number;
    veterinarianId: number;
    notes?: string;
}