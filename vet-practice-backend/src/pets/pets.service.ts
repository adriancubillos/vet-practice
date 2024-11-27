import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { User } from '../user/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

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

    // If imageUrl is empty string, set it to null
    if (imageUrl === '') {
      imageUrl = null;
    }

    // If there's a new image and the pet already has an image, delete the old one
    if (imageUrl && pet.imageUrl) {
      const oldImagePath = path.join(process.cwd(), 'uploads/pets', path.basename(pet.imageUrl));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // If imageUrl is null and there was an old image, delete it
    if (imageUrl === null && pet.imageUrl) {
      const oldImagePath = path.join(process.cwd(), 'uploads/pets', path.basename(pet.imageUrl));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

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
    if (pet.imageUrl) {
      const imagePath = path.join(process.cwd(), 'uploads/pets', path.basename(pet.imageUrl));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await this.petsRepository.remove(pet);
  }
}