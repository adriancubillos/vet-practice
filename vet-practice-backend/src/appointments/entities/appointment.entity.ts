import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { MedicalHistory } from '../../pets/entities/medical-history.entity';

export enum AppointmentStatus {
    SCHEDULED = 'scheduled',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no_show'
}

@Entity('appointment')
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp' })
    dateTime: Date;

    @Column({
        type: 'enum',
        enum: AppointmentStatus,
        default: AppointmentStatus.SCHEDULED
    })
    status: AppointmentStatus;

    // Medical record fields for this specific appointment
    @Column({ type: 'text', nullable: true })
    symptoms: string;

    @Column({ type: 'text', nullable: true })
    diagnosis: string;

    @Column({ type: 'text', nullable: true })
    treatment: string;

    @Column({ type: 'text', nullable: true })
    prescriptions: string;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    weight: number;

    @Column({ type: 'json', nullable: true })
    vitals: {
        temperature?: number;
        heartRate?: number;
        respiratoryRate?: number;
        bloodPressure?: string;
    };

    @Column({ nullable: true })
    followUpNeeded: boolean;

    @Column({ type: 'date', nullable: true })
    followUpDate: Date;

    // Relations
    @ManyToOne(() => User, user => user.clientAppointments)
    user: User;

    @ManyToOne(() => User, user => user.veterinarianAppointments)
    veterinarian: User;

    @ManyToOne(() => Pet, pet => pet.appointments)
    pet: Pet;

    @ManyToOne(() => MedicalHistory, medicalHistory => medicalHistory.appointments)
    medicalHistory: MedicalHistory;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}