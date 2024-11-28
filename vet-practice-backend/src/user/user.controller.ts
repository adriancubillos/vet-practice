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
import { Public } from '../auth/public.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.id;
    return this.userService.findOne(userId);
  }

  @Get('profile/pets')
  async getUserPets(@Request() req) {
    const userId = req.user.id;
    return this.userService.findUserPets(userId);
  }

  @Patch('profile')
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const userId = req.user.id;
    return this.userService.update(userId, updateUserDto);
  }

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

  @Public()
  @Get('roles')
  getRoles() {
    return Object.values(Role);
  }
}