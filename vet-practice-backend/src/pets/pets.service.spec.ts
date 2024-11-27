import { Test, TestingModule } from '@nestjs/testing';
import { PetsService } from './pets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pet, Gender } from './entities/pet.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

describe('PetsService', () => {
    let service: PetsService;
    let repo: Repository<Pet>;

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
        isActive: true,
    }

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

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PetsService,
                {
                    provide: getRepositoryToken(Pet),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<PetsService>(PetsService);
        repo = module.get<Repository<Pet>>(getRepositoryToken(Pet));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a pet', async () => {
            const createPetDto = {
                name: 'Max',
                species: 'Dog',
                breed: 'Golden Retriever',
                dateOfBirth: new Date('2020-01-01'),
                gender: Gender.MALE,
                weight: 25.5,
            };

            mockRepository.create.mockReturnValue(mockPet);
            mockRepository.save.mockResolvedValue(mockPet);

            const result = await service.create(createPetDto, null, mockUser);
            expect(result).toEqual(mockPet);
            expect(mockRepository.create).toHaveBeenCalledWith({
                ...createPetDto,
                imageUrl: null,
                owner: mockUser,
            });
        });
    });

    describe('findAll', () => {
        it('should return all pets', async () => {
            const mockPets = [mockPet];
            mockRepository.find.mockResolvedValue(mockPets);

            const result = await service.findAll();
            expect(result).toEqual(mockPets);
            expect(mockRepository.find).toHaveBeenCalled();
        });
    });

    describe('findByOwner', () => {
        it('should return pets for specific owner', async () => {
            const mockPets = [mockPet];
            mockRepository.find.mockResolvedValue(mockPets);

            const result = await service.findByOwner(mockUser);
            expect(result).toEqual(mockPets);
            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { owner: { id: mockUser.id } },
            });
        });
    });
});