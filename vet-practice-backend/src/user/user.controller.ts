import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

//TODO updateUser, deleteUser

  @Post()
  async createUser(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.userService.register(registerUserDto);
  }
}