import { 
  Controller, 
  Post, 
  Get, 
  Put,
  Delete,
  Param,
  Body, 
  UseInterceptors, 
  UploadedFile, 
  Request, 
  UseGuards, 
  ParseFilePipe, 
  MaxFileSizeValidator, 
  FileTypeValidator,
  ParseIntPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
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

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.petsService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePetDto: UpdatePetDto,
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
    return this.petsService.update(id, updatePetDto, imageUrl, req.user);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.petsService.remove(id, req.user);
    return { message: 'Pet deleted successfully' };
  }

  @Get('all')
  async findAllPets() {
    return this.petsService.findAll();
  }
}