import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MedicalHistory } from './medical-history.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Vaccination {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'timestamp' })
    dateAdministered: Date;

    @Column({ type: 'timestamp' })
    nextDueDate: Date;

    @Column()
    batchNumber: string;

    @ManyToOne(() => MedicalHistory, medicalHistory => medicalHistory.vaccinations)
    medicalHistory: MedicalHistory;

    @ManyToOne(() => User, { eager: true })
    administeredBy: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
