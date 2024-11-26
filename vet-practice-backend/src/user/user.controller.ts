import { 
  Body, 
  Controller, 
  Post, 
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  HttpStatus,
  HttpCode,
  ParseIntPipe
} from '@nestjs/common';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string): Promise<User> {
    return this.userService.findOne(parseInt(id, 10));
  }

  @Post()
  async create(@Body() createUserDto: RegisterUserDto): Promise<User> {
    return this.userService.register(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(parseInt(id, 10), updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string): Promise<User> {
    return this.userService.remove(parseInt(id, 10));
  }
}