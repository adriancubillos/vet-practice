import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async validateUserForLogin(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async validateUserForRegistration(email: string, username: string): Promise<boolean> {
    // Check if email exists
    const userByEmail = await this.userService.findUserByEmail(email);
    if (userByEmail) {
      throw new UnauthorizedException('Email already exists');
    }

    // Check if username exists
    const userByUsername = await this.userService.findUserByUsername(username);
    if (userByUsername) {
      throw new UnauthorizedException('Username already exists');
    }

    return true;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    };
  }
}