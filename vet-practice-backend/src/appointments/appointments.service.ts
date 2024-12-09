import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from '../user/entities/user.entity';
import { Pet } from '../pets/entities/pet.entity';
import { MedicalHistory } from '../pets/entities/medical-history.entity';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,
        @InjectRepository(Pet)
        private petRepository: Repository<Pet>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(MedicalHistory)
        private medicalHistoryRepository: Repository<MedicalHistory>,
    ) { }

    async create(createAppointmentDto: CreateAppointmentDto, userId: number): Promise<Appointment> {
        const { petId, veterinarianId, dateTime, notes, duration } = createAppointmentDto;

        // Find the current user to check role
        const currentUser = await this.userRepository.findOne({
            where: { id: userId }
        });
        if (!currentUser) {
            throw new NotFoundException('User not found');
        }

        // Find the pet
        const pet = await this.petRepository.findOne({
            where: { id: petId },
            relations: ['owner']
        });
        if (!pet) {
            throw new NotFoundException('Pet not found');
        }

        // Only check pet ownership if user is not admin or vet
        if (currentUser.role !== Role.ADMIN && currentUser.role !== Role.VET && pet.owner.id !== userId) {
            throw new BadRequestException('You can only create appointments for your own pets');
        }

        // Find the veterinarian
        const veterinarian = await this.userRepository.findOne({
            where: { id: veterinarianId }
        });
        if (!veterinarian) {
            throw new NotFoundException('Veterinarian not found');
        }

        // Check if the veterinarian is available at the requested time
        const existingAppointment = await this.appointmentRepository.findOne({
            where: {
                veterinarian: { id: veterinarianId },
                dateTime: dateTime,
                status: AppointmentStatus.SCHEDULED
            }
        });
        if (existingAppointment) {
            throw new BadRequestException('Veterinarian is not available at this time');
        }

        // Create the appointment
        const appointment = this.appointmentRepository.create({
            pet,
            veterinarian,
            user: pet.owner,
            dateTime,
            notes,
            duration: duration || 30, // Set default duration to 30 minutes if not provided
            status: AppointmentStatus.SCHEDULED
        });

        return this.appointmentRepository.save(appointment);
    }

    async findAll(filters: {
        userId?: number,
        status?: AppointmentStatus,
        startDate?: Date,
        endDate?: Date,
        veterinarianId?: number,
        petId?: number
    }): Promise<Appointment[]> {
        const { userId, status, startDate, endDate, veterinarianId, petId } = filters;

        // First get the user to check their role
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        let whereClause: any = {};

        // Add filters if provided
        if (status) {
            whereClause.status = status;
        }
        if (startDate && endDate) {
            whereClause.dateTime = Between(startDate, endDate);
        } else if (startDate) {
            whereClause.dateTime = MoreThanOrEqual(startDate);
        } else if (endDate) {
            whereClause.dateTime = LessThanOrEqual(endDate);
        }
        if (petId) {
            whereClause.pet = { id: petId };
        }
        if (veterinarianId) {
            whereClause.veterinarian = { id: veterinarianId };
        }

        // If regular user, only show their appointments
        if (user.role !== Role.ADMIN && user.role !== Role.VET) {
            whereClause.user = { id: userId };
        }

        return this.appointmentRepository.find({
            where: whereClause,
            relations: ['pet', 'pet.owner', 'veterinarian'],
            order: {
                dateTime: 'DESC'
            }
        });
    }

    async findOne(id: number): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findOne({
            where: { id },
            relations: ['pet', 'veterinarian', 'user', 'medicalHistory']
        });
        if (!appointment) {
            throw new NotFoundException(`Appointment with ID ${id} not found`);
        }
        return appointment;
    }

    async update(id: number, updateAppointmentDto: UpdateAppointmentDto, userId: number): Promise<Appointment> {
        const appointment = await this.findOne(id);

        // Only allow updates by the veterinarian or the pet owner
        if (appointment.veterinarian.id !== userId && appointment.user.id !== userId) {
            throw new BadRequestException('You are not authorized to update this appointment');
        }

        // If updating medical details, ensure it's the veterinarian
        if ((updateAppointmentDto.diagnosis || updateAppointmentDto.treatment ||
            updateAppointmentDto.prescriptions || updateAppointmentDto.vitals) &&
            appointment.veterinarian.id !== userId) {
            throw new BadRequestException('Only the veterinarian can update medical details');
        }

        // If marking as completed, create a medical history entry
        if (updateAppointmentDto.status === AppointmentStatus.COMPLETED) {
            const medicalHistory = await this.medicalHistoryRepository.findOne({
                where: { pet: { id: appointment.pet.id } }
            });

            if (medicalHistory) {
                // Update the medical history with appointment details
                if (updateAppointmentDto.diagnosis || updateAppointmentDto.treatment ||
                    updateAppointmentDto.prescriptions || updateAppointmentDto.vitals) {
                    medicalHistory.specialNotes = [
                        medicalHistory.specialNotes || '',
                        `Visit on ${appointment.dateTime.toISOString()}:`,
                        updateAppointmentDto.diagnosis ? `Diagnosis: ${updateAppointmentDto.diagnosis}` : '',
                        updateAppointmentDto.treatment ? `Treatment: ${updateAppointmentDto.treatment}` : '',
                        updateAppointmentDto.prescriptions ? `Prescriptions: ${updateAppointmentDto.prescriptions}` : ''
                    ].filter(note => note).join('\n');

                    await this.medicalHistoryRepository.save(medicalHistory);
                }
            }
        }

        Object.assign(appointment, updateAppointmentDto);
        return this.appointmentRepository.save(appointment);
    }

    async cancel(id: number, userId: number): Promise<Appointment> {
        const appointment = await this.findOne(id);

        // Only allow cancellation by the veterinarian or the pet owner
        if (appointment.veterinarian.id !== userId && appointment.user.id !== userId) {
            throw new BadRequestException('You are not authorized to cancel this appointment');
        }

        appointment.status = AppointmentStatus.CANCELLED;
        return this.appointmentRepository.save(appointment);
    }

    async findUpcomingAppointments(userId: number, isVeterinarian: boolean): Promise<Appointment[]> {
        const query = this.appointmentRepository.createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.pet', 'pet')
            .leftJoinAndSelect('appointment.veterinarian', 'veterinarian')
            .leftJoinAndSelect('appointment.user', 'user')
            .where('appointment.dateTime > :now', { now: new Date() })
            .andWhere('appointment.status = :status', { status: AppointmentStatus.SCHEDULED });

        if (isVeterinarian) {
            query.andWhere('veterinarian.id = :userId', { userId });
        } else {
            query.andWhere('user.id = :userId', { userId });
        }

        return query.getMany();
    }

    async findVeterinarianAvailability(veterinarianId: number, date: Date): Promise<boolean[]> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const appointments = await this.appointmentRepository.find({
            where: {
                veterinarian: { id: veterinarianId },
                dateTime: Between(startOfDay, endOfDay),
                status: AppointmentStatus.SCHEDULED
            }
        });

        // Assuming 30-minute slots from 9 AM to 5 PM
        const slots = new Array(16).fill(true); // 16 half-hour slots
        appointments.forEach(appointment => {
            const hour = appointment.dateTime.getHours();
            const minutes = appointment.dateTime.getMinutes();
            const slotIndex = (hour - 9) * 2 + (minutes >= 30 ? 1 : 0);
            slots[slotIndex] = false;
        });

        return slots;
    }
}