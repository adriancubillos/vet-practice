import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { VaccinationsService } from './vaccinations.service';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('vaccinations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pets/:petId/vaccinations')
export class VaccinationsController {
  constructor(private readonly vaccinationsService: VaccinationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get vaccinations for a pet' })
  @ApiResponse({ status: 200, description: 'Returns vaccinations list' })
  async getVaccinations(
    @Param('petId', ParseIntPipe) petId: number,
    @Request() req,
  ) {
    return this.vaccinationsService.findAll(petId, req.user);
  }

  @Post()
  @Roles(Role.VET)
  @ApiOperation({ summary: 'Add a vaccination record' })
  @ApiResponse({ status: 201, description: 'Vaccination record created' })
  async addVaccination(
    @Param('petId', ParseIntPipe) petId: number,
    @Body() createVaccinationDto: CreateVaccinationDto,
    @Request() req,
  ) {
    return this.vaccinationsService.create(petId, createVaccinationDto, req.user);
  }
}
