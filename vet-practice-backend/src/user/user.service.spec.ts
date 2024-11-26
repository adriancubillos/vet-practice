import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
      address: '123 Test St',
      phoneNumber: '1234567890',
    };

    it('should successfully register a new user', async () => {
      const hashedPassword = 'hashedPassword';
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashedPassword));
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({ ...registerDto, id: 1 });
      mockUserRepository.save.mockResolvedValue({ ...registerDto, id: 1, password: hashedPassword });

      const result = await service.register(registerDto);

      expect(result).toEqual({
        ...registerDto,
        id: 1,
        password: hashedPassword,
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 1, email: registerDto.email });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, email: 'test@example.com' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findUserByEmail('test@example.com');
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findUserByEmail('test@example.com');
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, username: 'test' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: 1, username: 'test1' },
        { id: 2, username: 'test2' },
      ];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const updateDto = { username: 'updated' };
      const existingUser = {
        id: 1,
        username: 'test',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test St',
        phoneNumber: '1234567890',
      };
      const updatedUser = { ...existingUser, ...updateDto };

      // Mock findOne for getting the user
      mockUserRepository.findOne.mockImplementation(async (options) => {
        if (options.where.id === 1) {
          return existingUser;
        }
        if (options.where.username === updateDto.username) {
          return null; // No other user with this username
        }
        return null;
      });
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, { username: 'updated' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if username already exists', async () => {
      const existingUser = {
        id: 1,
        username: 'test',
        email: 'test@example.com',
      };
      const otherUser = {
        id: 2,
        username: 'updated',
        email: 'other@example.com',
      };

      // Mock findOne to return the existing user for ID lookup
      // and the other user for username lookup
      mockUserRepository.findOne.mockImplementation(async (options) => {
        if (options.where.id === 1) {
          return existingUser;
        }
        if (options.where.username === 'updated') {
          return otherUser; // Another user already has this username
        }
        return null;
      });

      await expect(
        service.update(1, { username: 'updated' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete and return the user', async () => {
      const user = { id: 1, username: 'test' };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('generateJwt', () => {
    it('should generate a JWT token', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        username: 'test',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test St',
        phoneNumber: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
      const token = 'jwt-token';
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.generateJwt(user);
      expect(result).toBe(token);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
      });
    });
  });
});
