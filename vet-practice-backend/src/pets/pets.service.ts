import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { User } from '../user/user.entity';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private petsRepository: Repository<Pet>,
  ) {}

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
    const pet = await this.petsRepository.findOne({ where: { id } });
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
}