import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Pet } from '../../pets/entities/pet.entity';
import { Role } from '../../auth/enums/role.enum';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToMany(() => Pet, pet => pet.owner)
  pets: Pet[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ nullable: true })
  imageUrl: string;

  // Veterinarian specific fields
  @Column({ nullable: true })
  specialization: string;

  @Column({ nullable: true })
  licenseNumber: string;

  @Column({ type: 'json', nullable: true })
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];

  @Column({ type: 'simple-array', nullable: true })
  expertise: string[];

  // Appointments relations
  @OneToMany(() => Appointment, appointment => appointment.veterinarian)
  veterinarianAppointments: Appointment[];

  @OneToMany(() => Appointment, appointment => appointment.user)
  clientAppointments: Appointment[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}