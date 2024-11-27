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
    const userId = 1;
    const updateDto = { 
      username: 'updated',
      email: 'newemail@example.com',
      password: 'NewPassword123!',
      firstName: 'Updated',
      lastName: 'User'
    };

    it('should update and return the user', async () => {
      const existingUser = {
        id: userId,
        username: 'original',
        email: 'original@example.com',
        password: 'hashedpassword',
      };
      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue({ ...existingUser, ...updateDto });

      const result = await service.update(userId, updateDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        id: userId,
        username: updateDto.username,
        email: updateDto.email,
      }));
    });

    it('should hash password when updating password', async () => {
      const existingUser = {
        id: userId,
        username: 'original',
        email: 'original@example.com',
        password: 'oldhashed',
      };
      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockImplementation(user => Promise.resolve(user));
      
      const hashedPassword = 'newhashed';
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashedPassword));

      const result = await service.update(userId, { password: 'NewPassword123!' });

      expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword123!', 10);
      expect(result.password).toBe(hashedPassword);
    });

    it('should not hash password if not updating password', async () => {
      const existingUser = {
        id: userId,
        username: 'original',
        email: 'original@example.com',
        password: 'oldhashed',
      };
      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockImplementation(user => Promise.resolve(user));
      
      const spy = jest.spyOn(bcrypt, 'hash');

      await service.update(userId, { username: 'newname' });

      expect(spy).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when updating to existing email', async () => {
      const existingUser = {
        id: userId,
        email: 'original@example.com',
      };
      mockUserRepository.findOne
        .mockResolvedValueOnce(existingUser) // First call for finding user by id
        .mockResolvedValueOnce({ id: 2 }); // Second call for finding user by email

      await expect(service.update(userId, { email: 'existing@example.com' }))
        .rejects
        .toThrow(ConflictException);
    });

    it('should allow same email for same user', async () => {
      const existingUser = {
        id: userId,
        email: 'same@example.com',
      };
      mockUserRepository.findOne
        .mockResolvedValueOnce(existingUser) // First call for finding user by id
        .mockResolvedValueOnce({ id: userId }); // Second call for finding user by email
      mockUserRepository.save.mockImplementation(user => Promise.resolve(user));

      const result = await service.update(userId, { email: 'same@example.com' });

      expect(result.email).toBe('same@example.com');
    });
  });

  describe('deactivate', () => {
    const userId = 1;

    it('should deactivate user', async () => {
      const user = {
        id: userId,
        isActive: true,
      };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockImplementation(user => Promise.resolve(user));

      const result = await service.deactivate(userId);

      expect(result.isActive).toBe(false);
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        id: userId,
        isActive: false,
      }));
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.deactivate(userId))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('activate', () => {
    const userId = 1;

    it('should activate user', async () => {
      const user = {
        id: userId,
        isActive: false,
      };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockImplementation(user => Promise.resolve(user));

      const result = await service.activate(userId);

      expect(result.isActive).toBe(true);
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        id: userId,
        isActive: true,
      }));
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.activate(userId))
        .rejects
        .toThrow(NotFoundException);
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
