import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { Not, Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { imageChecksUtil } from 'src/utils/common-utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number | string): Promise<User> {
    const userId = typeof id === 'string' ? parseInt(id, 10) : id;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['pets']
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    const { password, ...result } = user;
    return result as User;
  }

  async update(id: number, updateUserDto: UpdateUserDto, imageUrl: string | null): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being updated and if it's already taken
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    imageChecksUtil(user, imageUrl, 'uploads/users');
    // Update the pet with new data
    Object.assign(user, {
      ...updateUserDto,
      imageUrl: imageUrl ?? user.imageUrl, // Only update imageUrl if it's not null
    });

    // Hash password if it's being updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async deactivate(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.isActive = false;
    return this.userRepository.save(user);
  }

  async activate(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.isActive = true;
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);

    // Delete the pet's image if it exists
    if (user.imageUrl) {
      const imagePath = path.join(process.cwd(), 'uploads/users', path.basename(user.imageUrl));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await this.userRepository.delete(id);
    return user;
  }

  async register(registerUserDto: RegisterUserDto, imageUrl: string | null): Promise<User> {
    const { email, username } = registerUserDto;

    // Check for existing user
    const existingUserByEmail = await this.findUserByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingUserByUsername = await this.findUserByUsername(username);
    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    // Create new user
    const user = this.userRepository.create({
      ...registerUserDto,
      password: hashedPassword,
    });

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findUserPets(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['pets']
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    return user.pets;
  }

  async findAllUsersExceptCurrent(userId: number): Promise<User[]> {
    return this.userRepository.find({ where: { id: Not(userId) } });
  }

  async generateJwt(user: User): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}