import { Test, TestingModule } from '@nestjs/testing';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { Gender } from './entities/pet.entity';
import { User } from '../user/user.entity';

describe('PetsController', () => {
  let controller: PetsController;
  let service: PetsService;

  const mockPetsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByOwner: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    username: 'johndoe',
    email: 'test@example.com',
    password: 'hashedpassword',
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Street',
    phoneNumber: '1234567890',
    pets: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  };

  const mockPet = {
    id: 1,
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    dateOfBirth: new Date('2020-01-01'),
    gender: Gender.MALE,
    weight: 25.5,
    imageUrl: null,
    owner: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetsController],
      providers: [
        {
          provide: PetsService,
          useValue: mockPetsService,
        },
      ],
    }).compile();

    controller = module.get<PetsController>(PetsController);
    service = module.get<PetsService>(PetsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a pet', async () => {
      const createPetDto: CreatePetDto = {
        name: 'Max',
        species: 'Dog',
        breed: 'Golden Retriever',
        dateOfBirth: new Date('2020-01-01'),
        gender: Gender.MALE,
        weight: 25.5,
      };

      mockPetsService.create.mockResolvedValue(mockPet);

      const result = await controller.create(createPetDto, undefined, { user: mockUser });
      expect(result).toEqual(mockPet);
      expect(mockPetsService.create).toHaveBeenCalledWith(createPetDto, null, mockUser);
    });

    it('should create a pet with image', async () => {
      const createPetDto: CreatePetDto = {
        name: 'Max',
        species: 'Dog',
        breed: 'Golden Retriever',
        dateOfBirth: new Date('2020-01-01'),
        gender: Gender.MALE,
        weight: 25.5,
      };

      const mockFile = {
        filename: 'test-image.jpg',
      };

      const expectedImageUrl = `/uploads/pets/${mockFile.filename}`;
      const petWithImage = { ...mockPet, imageUrl: expectedImageUrl };
      mockPetsService.create.mockResolvedValue(petWithImage);

      const result = await controller.create(createPetDto, mockFile as any, { user: mockUser });
      expect(result).toEqual(petWithImage);
      expect(mockPetsService.create).toHaveBeenCalledWith(createPetDto, expectedImageUrl, mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all pets for the current user', async () => {
      const mockPets = [mockPet];
      mockPetsService.findByOwner.mockResolvedValue(mockPets);

      const result = await controller.findAll({ user: mockUser });
      expect(result).toEqual(mockPets);
      expect(mockPetsService.findByOwner).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findAllPets', () => {
    it('should return all pets in the system', async () => {
      const mockPets = [mockPet];
      mockPetsService.findAll.mockResolvedValue(mockPets);

      const result = await controller.findAllPets();
      expect(result).toEqual(mockPets);
      expect(mockPetsService.findAll).toHaveBeenCalled();
    });
  });
});