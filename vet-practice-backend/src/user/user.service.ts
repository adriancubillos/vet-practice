import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    // private authService: AuthService
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Validate user data first
      // await this.authService.validateUserForRegistration(
      //   createUserDto.email,
      //   createUserDto.username
      // );

      // Hash the password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      // Create the user with all fields
      const user = this.usersRepository.create({
        username: createUserDto.username,
        email: createUserDto.email,
        password: hashedPassword,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        address: createUserDto.address,
        phoneNumber: createUserDto.phoneNumber,
      });

      // Save the user
      await this.usersRepository.save(user);

      // Remove password from response
      const { password, ...result } = user;
      return result as User;
    } catch (error) {
      if (error.code === '23505') { // Unique violation error code
        throw new ConflictException('Username or email already exists');
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findUserByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async generateJwt(user: User): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}