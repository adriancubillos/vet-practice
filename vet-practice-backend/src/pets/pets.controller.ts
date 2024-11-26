import { Controller, Post, Body, UseInterceptors, UploadedFile, Request, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pets')
@UseGuards(JwtAuthGuard)
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createPetDto: CreatePetDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const imageUrl = file ? `/uploads/pets/${file.filename}` : null;
    return this.petsService.create(createPetDto, imageUrl, req.user);
  }
}