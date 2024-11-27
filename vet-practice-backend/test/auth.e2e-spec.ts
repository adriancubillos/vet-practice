import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../src/user/user.entity';
import { Pet } from '../src/pets/entities/pet.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

jest.setTimeout(30000); // Increase timeout to 30 seconds

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let userRepository: Repository<User>;
  let petRepository: Repository<Pet>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: parseInt(configService.get('DB_PORT'), 10),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('TEST_DB_DATABASE'),
            entities: [User, Pet], // Add Pet entity
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    configService = moduleFixture.get<ConfigService>(ConfigService);
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    petRepository = moduleFixture.get<Repository<Pet>>(getRepositoryToken(Pet));

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }));

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get('Reflector')));

    await app.init();
  });

  beforeEach(async () => {
    if (petRepository && userRepository) {
      await petRepository.delete({});
      await userRepository.delete({});
    }
  });

  afterAll(async () => {
    if (petRepository && userRepository) {
      await petRepository.delete({});
      await userRepository.delete({});
    }
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    const registerDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
      address: '123 Test St',
      phoneNumber: '1234567890',
    };

    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe(registerDto.email);
          expect(res.body.username).toBe(registerDto.username);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should fail when registering with existing email', async () => {
      // First register a user
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);

      // Try to register again with same email
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(409)
        .expect((res) => {
          expect(res.body.message).toBe('Email already exists');
        });
    });

    it('should fail when registering with invalid data', () => {
      const invalidDto = {
        ...registerDto,
        email: 'invalid-email',
        password: '123', // Too short
      };
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    const registerDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
      address: '123 Test St',
      phoneNumber: '1234567890',
    };

    const loginDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    beforeEach(async () => {
      // Register a user before each login test
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);
    });

    it('should login successfully with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(typeof res.body.accessToken).toBe('string');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user.email).toBe(loginDto.email);
          expect(res.body.user.firstName).toBe(registerDto.firstName);
          expect(res.body.user.lastName).toBe(registerDto.lastName);
          expect(res.body.user).not.toHaveProperty('password');
        });
    });

    it('should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          ...loginDto,
          password: 'wrongpassword',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Invalid email or password');
        });
    });

    it('should fail with non-existent user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Invalid email or password');
        });
    });
  });

  describe('/auth/profile (GET)', () => {
    let accessToken: string;
    const registerDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
      address: '123 Test St',
      phoneNumber: '1234567890',
    };

    beforeEach(async () => {
      // Register a user
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);

      // Login to get access token
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: registerDto.email,
          password: registerDto.password,
        });

      accessToken = loginResponse.body.accessToken;
    });

    it('should get user profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe(registerDto.email);
          expect(res.body.firstName).toBe(registerDto.firstName);
          expect(res.body.lastName).toBe(registerDto.lastName);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should fail to get profile without token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);
    });

    it('should fail to get profile with invalid token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should fail to get profile with malformed token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer')
        .expect(401);
    });

    it('should fail to get profile with token in wrong format', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', accessToken) // Missing "Bearer" prefix
        .expect(401);
    });

    it('should fail to get profile with expired token', async () => {
      // Create a token that's already expired
      const expiredToken = await app.get(JwtService).signAsync(
        { sub: 1, email: registerDto.email },
        { expiresIn: '0s' }
      );

      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });
  });

  describe('validation errors', () => {
    it('should return specific validation errors for invalid registration data', () => {
      const invalidDto = {
        username: 'a', // too short
        email: 'invalid-email',
        password: '123', // too short
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: 'abc', // invalid format
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(expect.arrayContaining([
            expect.stringContaining('username'),
            expect.stringContaining('email'),
            expect.stringContaining('password'),
            expect.stringContaining('firstName'),
            expect.stringContaining('lastName'),
            expect.stringContaining('phoneNumber'),
          ]));
        });
    });

    it('should return specific validation errors for invalid login data', () => {
      const invalidDto = {
        email: 'invalid-email',
        password: '',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(expect.arrayContaining([
            expect.stringContaining('email'),
            expect.stringContaining('password'),
          ]));
        });
    });
  });
});
