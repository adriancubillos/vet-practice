import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: any }> {
    const user = await this.validateUser(loginDto);
    
    const payload = { 
      sub: user.id,
      email: user.email,
      role: user.role
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    };
  }

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.userService.findUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password, ...result } = user;
    return result;
  }

  async getProfile(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    const { password, ...result } = user;
    return result;
  }
}