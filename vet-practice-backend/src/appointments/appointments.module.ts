import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './entities/appointment.entity';
import { Pet } from '../pets/entities/pet.entity';
import { User } from '../user/entities/user.entity';
import { MedicalHistory } from '../pets/entities/medical-history.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Appointment,
            Pet,
            User,
            MedicalHistory
        ])
    ],
    controllers: [AppointmentsController],
    providers: [AppointmentsService],
    exports: [AppointmentsService]
})
export class AppointmentsModule {}