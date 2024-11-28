import { Body, Controller, Post, Get, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role } from './enums/role.enum';
import { RoleInfo, roleLabels } from './dto/roles.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string; user: any }> {
    return this.authService.login(loginDto);
  }

  @Get('roles')
  getRoles(): RoleInfo[] {
    return Object.values(Role).map(role => ({
      value: role,
      label: roleLabels[role]
    }));
  }
}
