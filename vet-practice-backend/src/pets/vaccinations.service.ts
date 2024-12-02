import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vaccination } from './entities/vaccination.entity';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { PetsService } from './pets.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class VaccinationsService {
  constructor(
    @InjectRepository(Vaccination)
    private vaccinationsRepository: Repository<Vaccination>,
    private petsService: PetsService,
  ) {}

  async findAll(petId: number, user: User) {
    const pet = await this.petsService.findOne(petId);
    
    // Check if user has access to this pet's medical history
    if (pet.owner.id !== user.id && !user.role.includes('vet')) {
      throw new ForbiddenException('You do not have permission to view this pet\'s vaccinations');
    }

    return this.vaccinationsRepository.find({
      where: { medicalHistory: { pet: { id: petId } } },
      order: { dateAdministered: 'DESC' },
      relations: ['administeredBy'],
    });
  }

  async create(petId: number, createVaccinationDto: CreateVaccinationDto, user: User) {
    // Only vets can create vaccination records
    if (!user.role.includes('vet')) {
      throw new ForbiddenException('Only veterinarians can create vaccination records');
    }

    const pet = await this.petsService.getMedicalHistory(petId, user);
    if (!pet.medicalHistory) {
      throw new NotFoundException('Medical history not found for this pet');
    }

    const vaccination = this.vaccinationsRepository.create({
      ...createVaccinationDto,
      medicalHistory: pet.medicalHistory,
      administeredBy: user, // Set the current vet as the administrator
    });

    return this.vaccinationsRepository.save(vaccination);
  }
}
