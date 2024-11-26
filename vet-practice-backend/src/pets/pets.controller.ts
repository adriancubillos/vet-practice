import { Controller, Post, Get, Body, UseInterceptors, UploadedFile, Request, UseGuards, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
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
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File | undefined,
    @Request() req,
  ) {
    const imageUrl = file ? `/uploads/pets/${file.filename}` : null;
    return this.petsService.create(createPetDto, imageUrl, req.user);
  }

  @Get()
  async findAll(@Request() req) {
    return this.petsService.findByOwner(req.user);
  }

  @Get('all')
  async findAllPets() {
    return this.petsService.findAll();
  }
}