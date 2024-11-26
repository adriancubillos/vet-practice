import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
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

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.validateUser(loginDto);
    
    const payload = { 
      sub: user.id,
      email: user.email
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
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
}