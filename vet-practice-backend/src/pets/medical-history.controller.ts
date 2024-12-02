import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { PetsService } from './pets.service';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('medical-history')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pets/:petId/medical-history')
export class MedicalHistoryController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get medical history for a pet' })
  @ApiResponse({ status: 200, description: 'Returns medical history' })
  async getMedicalHistory(
    @Param('petId', ParseIntPipe) petId: number,
    @Request() req,
  ) {
    return this.petsService.getMedicalHistory(petId, req.user);
  }

  @Post()
  @Roles(Role.VET)
  @ApiOperation({ summary: 'Create medical history for a pet' })
  @ApiResponse({ status: 201, description: 'Medical history created successfully' })
  async createMedicalHistory(
    @Param('petId', ParseIntPipe) petId: number,
    @Body() createMedicalHistoryDto: CreateMedicalHistoryDto,
    @Request() req,
  ) {
    return this.petsService.createMedicalHistory(petId, createMedicalHistoryDto, req.user);
  }

  @Patch()
  @Roles(Role.VET)
  @ApiOperation({ summary: 'Update medical history for a pet' })
  @ApiResponse({ status: 200, description: 'Medical history updated successfully' })
  async updateMedicalHistory(
    @Param('petId', ParseIntPipe) petId: number,
    @Body() updateMedicalHistoryDto: UpdateMedicalHistoryDto,
    @Request() req,
  ) {
    return this.petsService.updateMedicalHistory(petId, updateMedicalHistoryDto, req.user);
  }
}
