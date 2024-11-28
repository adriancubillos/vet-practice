import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    register: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ id: 1, username: 'test' }];
      mockUserService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = { id: 1, username: 'test' };
      mockUserService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        username: 'test',
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test St',
        phoneNumber: '1234567890',
      };
      const result = { id: 1, ...createUserDto };
      mockUserService.register.mockResolvedValue(result);

      expect(await controller.create(createUserDto, undefined, { user: createUserDto })).toBe(result);
      expect(mockUserService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        username: 'updated',
        email: 'updated@example.com',
      };
      const result = { id: 1, ...updateUserDto };
      mockUserService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateUserDto, undefined)).toBe(result);
      expect(mockUserService.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = { id: 1, username: 'test' };
      mockUserService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
      expect(mockUserService.remove).toHaveBeenCalledWith(1);
    });
  });
});
