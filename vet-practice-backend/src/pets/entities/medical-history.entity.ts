import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Pet } from './pet.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity()
export class MedicalHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Pet, pet => pet.medicalHistory)
    @JoinColumn()
    pet: Pet;

    @Column({ type: 'simple-array', nullable: true })
    allergies: string[];

    @Column({ type: 'simple-array', nullable: true })
    chronicConditions: string[];

    @Column({ type: 'text', nullable: true })
    specialNotes: string;

    @Column({ type: 'json', nullable: true })
    vaccinations: {
        name: string;
        dateAdministered: Date;
        nextDueDate: Date;
        batchNumber: string;
    }[];

    @OneToMany(() => Appointment, appointment => appointment.medicalHistory)
    appointments: Appointment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}