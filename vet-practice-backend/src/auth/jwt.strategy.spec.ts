import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userService: UserService;

  beforeEach(async () => {
    const mockUserService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    const payload = {
      sub: 1,
      email: 'test@example.com',
    };

    it('should return user data from payload', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test St',
        phoneNumber: '1234567890',
        isActive: true,
        pets: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      jest.spyOn(userService, 'findOne').mockResolvedValue(user);

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: payload.sub,
        email: payload.email,
        username: user.username,
      });
      expect(userService.findOne).toHaveBeenCalledWith(payload.sub);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userService.findOne).toHaveBeenCalledWith(payload.sub);
    });

    it('should throw UnauthorizedException when email in payload does not match user', async () => {
      const user = {
        id: 1,
        email: 'different@example.com',
        username: 'testuser',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test St',
        phoneNumber: '1234567890',
        isActive: true,
        pets: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      jest.spyOn(userService, 'findOne').mockResolvedValue(user);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userService.findOne).toHaveBeenCalledWith(payload.sub);
    });
  });
});
