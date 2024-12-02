import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { MedicalHistory } from './entities/medical-history.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { User } from '../user/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import { deleteImageInRepo, imageChecksUtil } from 'src/utils/common-utils';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private petsRepository: Repository<Pet>,
    @InjectRepository(MedicalHistory)
    private medicalHistoryRepository: Repository<MedicalHistory>,
  ) { }

  async create(createPetDto: CreatePetDto, imageUrl: string | null, owner: User): Promise<Pet> {
    const pet = this.petsRepository.create({
      ...createPetDto,
      imageUrl,
      owner,
    });
    return this.petsRepository.save(pet);
  }

  async findAll(): Promise<Pet[]> {
    return this.petsRepository.find();
  }

  async findOne(id: number): Promise<Pet> {
    const pet = await this.petsRepository.findOne({
      where: { id },
      relations: ['owner']
    });
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return pet;
  }

  async findByOwner(owner: User): Promise<Pet[]> {
    return this.petsRepository.find({
      where: { owner: { id: owner.id } },
    });
  }

  async update(id: number, updatePetDto: UpdatePetDto, imageUrl: string | null, user: User): Promise<Pet> {
    const pet = await this.findOne(id);

    // Check if the user is the owner of the pet
    if (pet.owner.id !== user.id) {
      throw new ForbiddenException('You can only update your own pets');
    }

    imageChecksUtil(pet, imageUrl, 'uploads/pets');

    // Update the pet with new data
    Object.assign(pet, {
      ...updatePetDto,
      imageUrl: imageUrl ?? pet.imageUrl, // Only update imageUrl if it's not null
    });

    return this.petsRepository.save(pet);
  }

  async remove(id: number, user: User): Promise<void> {
    const pet = await this.findOne(id);

    // Check if the user is the owner of the pet
    if (pet.owner.id !== user.id) {
      throw new ForbiddenException('You can only delete your own pets');
    }

    // Delete the pet's image if it exists
    deleteImageInRepo(pet, 'uploads/pets');

    await this.petsRepository.remove(pet);
  }

  async getMedicalHistory(petId: number, user: User) {
    const pet = await this.findOne(petId);

    // Check if user has access to this pet's medical history
    if (pet.owner.id !== user.id && !user.role.includes('vet')) {
      throw new ForbiddenException('You do not have permission to view this pet\'s medical history');
    }

    return this.petsRepository.findOne({
      where: { id: petId },
      relations: ['medicalHistory'],
    });
  }

  async updateMedicalHistory(petId: number, updateMedicalHistoryDto: any, user: User) {
    // Only vets can update medical history - this is also enforced by the @Roles decorator
    const pet = await this.findOne(petId);

    Object.assign(pet.medicalHistory, updateMedicalHistoryDto);
    return this.petsRepository.save(pet);
  }

  async createMedicalHistory(petId: number, createMedicalHistoryDto: CreateMedicalHistoryDto, user: User) {
    const pet = await this.findOne(petId);

    // Check if medical history already exists
    const existingHistory = await this.medicalHistoryRepository.findOne({
      where: { pet: { id: petId } }
    });

    if (existingHistory) {
      throw new ConflictException('Medical history already exists for this pet');
    }

    const medicalHistory = this.medicalHistoryRepository.create({
      ...createMedicalHistoryDto,
      pet,
    });

    return this.medicalHistoryRepository.save(medicalHistory);
  }
}