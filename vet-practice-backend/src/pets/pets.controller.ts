import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
  ForbiddenException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileUploadDecorator } from 'src/shared/decorators/file.upload.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetsService } from './pets.service';
import { imageChecksUtil } from 'src/utils/common-utils';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('pets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new pet' })
  @ApiResponse({ status: 201, description: 'Pet created successfully' })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createPetDto: CreatePetDto,
    @CreateFileUploadDecorator() file: Express.Multer.File | undefined,
    @Request() req,
  ) {
    const imageUrl = file ? `/uploads/pets/${file.filename}` : null;
    return this.petsService.create(createPetDto, imageUrl, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pets' })
  @ApiResponse({ status: 200, description: 'Returns all pets' })
  @Roles(Role.ADMIN, Role.VET)
  async findAll() {
    return this.petsService.findAll();
  }

  @Get('my-pets')
  @ApiOperation({ summary: 'Get current user\'s pets' })
  @ApiResponse({ status: 200, description: 'Returns user\'s pets' })
  async findUserPets(@Request() req) {
    return this.petsService.findByOwner(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific pet' })
  @ApiResponse({ status: 200, description: 'Returns the pet' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const pet = await this.petsService.findOne(id);

    // Check if user has access to this pet
    if (req.user.role !== Role.ADMIN &&
      req.user.role !== Role.VET &&
      pet.owner.id !== req.user.id) {
      throw new ForbiddenException('You do not have access to this pet');
    }

    return pet;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a pet' })
  @ApiResponse({ status: 200, description: 'Pet updated successfully' })
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePetDto: UpdatePetDto,
    @CreateFileUploadDecorator() file: Express.Multer.File | undefined,
    @Request() req,
  ) {
    const pet = await this.petsService.findOne(id);

    // Check if user has permission to update
    if (req.user.role !== Role.ADMIN && pet.owner.id !== req.user.id) {
      throw new ForbiddenException('You do not have permission to update this pet');
    }

    const imageUrl = file ? `/uploads/pets/${file.filename}` : null;
    imageChecksUtil(this.petsService.findOne(id), imageUrl, 'uploads/pets');
    await this.petsService.update(id, updatePetDto, imageUrl, req.user);
    return { message: 'Pet updated successfully' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pet' })
  @ApiResponse({ status: 200, description: 'Pet deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const pet = await this.petsService.findOne(id);

    // Check if user has permission to delete
    if (req.user.role !== Role.ADMIN && pet.owner.id !== req.user.id) {
      throw new ForbiddenException('You do not have permission to delete this pet');
    }

    await this.petsService.remove(id, req.user);
    return { message: 'Pet deleted successfully' };
  }
}