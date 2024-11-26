import { Body, Controller, Post, HttpCode, HttpStatus, UnauthorizedException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';

import { User } from './user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      return await this.userService.register(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException('Error creating user');
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() LoginDto: LoginDto): Promise<{ accessToken: string }> {
    try {
      const user = await this.userService.findUserByEmail(LoginDto.email);
      
      if (!user || !(await bcrypt.compare(LoginDto.password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const accessToken = await this.userService.generateJwt(user);
      return { accessToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}