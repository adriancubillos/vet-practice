import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { MedicalHistory } from './medical-history.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity()
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  species: string;

  @Column()
  breed: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => User, user => user.pets)
  owner: User;

  @OneToOne(() => MedicalHistory, medicalHistory => medicalHistory.pet)
  medicalHistory: MedicalHistory;

  @OneToMany(() => Appointment, appointment => appointment.pet)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}