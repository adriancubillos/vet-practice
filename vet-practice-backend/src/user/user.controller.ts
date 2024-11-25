import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService, private jwtService: JwtService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    const user = await this.userService.findUserByUsername(createUserDto.username);
    
    if (!user || !(await bcrypt.compare(createUserDto.password, user.password))) {
      throw new Error('Invalid credentials'); // Handle this better with custom exceptions
    }
    const accessToken = await this.userService.generateJwt(user);
    return { accessToken };
  }
}