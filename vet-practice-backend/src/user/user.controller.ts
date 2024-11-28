import { 
  Body, 
  Controller, 
  Post, 
  Get,
  Put,
  Patch,
  Delete,
  Param,
  UseGuards,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  Request
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../auth/enums/role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.userService.register(registerUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.id;
    return this.userService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/pets')
  async getUserPets(@Request() req) {
    const userId = req.user.id;
    return this.userService.findUserPets(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const userId = req.user.id;
    return this.userService.update(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string): Promise<User> {
    return this.userService.findOne(parseInt(id, 10));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUserDto: RegisterUserDto): Promise<User> {
    return this.userService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(parseInt(id, 10), updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string): Promise<User> {
    return this.userService.remove(parseInt(id, 10));
  }
}