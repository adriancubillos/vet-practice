import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Pet } from './pet.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Vaccination } from './vaccination.entity';

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

    @OneToMany(() => Vaccination, vaccination => vaccination.medicalHistory, {
        cascade: true,
        eager: true
    })
    vaccinations: Vaccination[];

    @OneToMany(() => Appointment, appointment => appointment.medicalHistory)
    appointments: Appointment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}