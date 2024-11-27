import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findUserByEmail: jest.fn(),
    register: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
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

    it('should register a new user', async () => {
      const expectedUser = { ...registerDto, id: 1 };
      mockUserService.register.mockResolvedValue(expectedUser);

      const result = await authService.register(registerDto);

      expect(mockUserService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      firstName: 'Test',
      lastName: 'User'
    };

    it('should return JWT token and user data when credentials are valid', async () => {
      const mockToken = 'jwt-token';
      mockUserService.findUserByEmail.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(mockToken);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await authService.login(loginDto);

      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockJwtService.signAsync).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken: mockToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName
        }
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUserService.findUserByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockUserService.findUserByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      address: '123 Test St',
      phoneNumber: '1234567890',
      pets: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    it('should return user without password when validation succeeds', async () => {
      mockUserService.findUserByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await authService.validateUser(loginDto);

      const { password, ...expectedResult } = mockUser;
      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUserService.findUserByEmail.mockResolvedValue(null);

      await expect(authService.validateUser(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockUserService.findUserByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(authService.validateUser(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getProfile', () => {
    const userId = 1;
    const mockUser = {
      id: userId,
      email: 'test@example.com',
      password: 'hashedPassword',
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      address: '123 Test St',
      phoneNumber: '1234567890',
      pets: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    it('should return user profile without password', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await authService.getProfile(userId);

      const { password, ...expectedResult } = mockUser;
      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      await expect(authService.getProfile(userId)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
