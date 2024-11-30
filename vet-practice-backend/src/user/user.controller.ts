import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileUploadDecorator } from 'src/shared/decorators/file.upload.decorator';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { imageChecksUtil } from 'src/utils/common-utils';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  @UseInterceptors(FileInterceptor('image'))
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @CreateFileUploadDecorator() file: Express.Multer.File | undefined,
  ): Promise<User> {
    const imageUrl = file ? `/uploads/users/${file.filename}` : null;
    return this.userService.register({ ...registerUserDto, role: Role.USER }, imageUrl);
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
  @Get('others')
  async findAllUsersExceptCurrent(@Request() req) {
    const userId = req.user.id;
    return this.userService.findAllUsersExceptCurrent(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @UseInterceptors(FileInterceptor('image'))
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
    @CreateFileUploadDecorator() file: Express.Multer.File | undefined,
  ): Promise<User> {
    const userId = req.user.id;
    const imageUrl = file ? `/uploads/users/${file.filename}` : null;
    return this.userService.update(userId, updateUserDto, imageUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/password')
  @HttpCode(HttpStatus.OK)
  async updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    const userId = req.user.id;
    return this.userService.updatePassword(userId, updatePasswordDto);
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
  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createUserDto: RegisterUserDto,
    @CreateFileUploadDecorator() file: Express.Multer.File | undefined,
    @Request() req,
  ): Promise<User> {
    let imageUrl;
    if (file) {
      imageUrl = `/uploads/users/${file.filename}`;
    } else if (createUserDto.imageUrl === '') {
      imageUrl = null;  // Convert empty string to null in database
    } else if (createUserDto.imageUrl) {
      imageUrl = createUserDto.imageUrl;
    }
    // Only admins can create users with specific roles
    if (req.user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only admins can create users');
    }
    return this.userService.register(createUserDto, imageUrl);
  }


  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CreateFileUploadDecorator() file: Express.Multer.File | undefined,
  ): Promise<{ message: string }> {
    // Handle image URL
    let imageUrl;
    if (file) {
      imageUrl = `/uploads/users/${file.filename}`;
    } else if (updateUserDto.imageUrl === '') {
      imageUrl = null;  // Convert empty string to null in database
    } else if (updateUserDto.imageUrl) {
      imageUrl = updateUserDto.imageUrl;
    }

    imageChecksUtil(this.userService.findOne(id), imageUrl, 'uploads/users');
    await this.userService.update(parseInt(id, 10), updateUserDto, imageUrl);
    return { message: 'User updated successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string): Promise<User> {
    return this.userService.remove(parseInt(id, 10));
  }
}