import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AppointmentStatus } from './entities/appointment.entity';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new appointment' })
    @ApiResponse({ status: 201, description: 'Appointment created successfully', type: AppointmentResponseDto })
    async create(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
        return this.appointmentsService.create(createAppointmentDto, req.user.id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all appointments with optional filters' })
    @ApiResponse({ status: 200, description: 'Returns all appointments', type: [AppointmentResponseDto] })
    async findAll(
        @Request() req,
        @Query('status') status?: AppointmentStatus,
        @Query('startDate') startDate?: Date,
        @Query('endDate') endDate?: Date,
        @Query('veterinarianId') veterinarianId?: number,
        @Query('petId') petId?: number,
        @Query('userId') userId?: number,
    ) {
        // If user is not an admin, restrict to their own appointments
        if (req.user.role !== Role.ADMIN) {
            if (req.user.role === Role.VET) {
                veterinarianId = req.user.id;
            } else {
                userId = req.user.id;
            }
        }

        return this.appointmentsService.findAll({
            status,
            startDate,
            endDate,
            veterinarianId,
            petId,
            userId
        });
    }

    @Get('upcoming')
    @ApiOperation({ summary: 'Get upcoming appointments for the authenticated user' })
    @ApiResponse({ status: 200, description: 'Returns upcoming appointments', type: [AppointmentResponseDto] })
    async findUpcoming(@Request() req) {
        const isVeterinarian = req.user.role === Role.VET;
        return this.appointmentsService.findUpcomingAppointments(req.user.id, isVeterinarian);
    }

    @Get('availability/:veterinarianId')
    @ApiOperation({ summary: 'Get veterinarian availability for a specific date' })
    @ApiResponse({ status: 200, description: 'Returns availability slots', type: [Boolean] })
    async getVeterinarianAvailability(
        @Param('veterinarianId') veterinarianId: number,
        @Query('date') date: Date
    ) {
        return this.appointmentsService.findVeterinarianAvailability(veterinarianId, date);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific appointment by ID' })
    @ApiResponse({ status: 200, description: 'Returns the appointment', type: AppointmentResponseDto })
    async findOne(@Param('id') id: number, @Request() req) {
        const appointment = await this.appointmentsService.findOne(id);

        // Check if user has access to this appointment
        if (req.user.role !== Role.ADMIN &&
            req.user.id !== appointment.user.id &&
            req.user.id !== appointment.veterinarian.id) {
            throw new ForbiddenException('You do not have access to this appointment');
        }

        return appointment;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an appointment' })
    @ApiResponse({ status: 200, description: 'Appointment updated successfully', type: AppointmentResponseDto })
    async update(
        @Param('id') id: number,
        @Body() updateAppointmentDto: UpdateAppointmentDto,
        @Request() req
    ) {
        return this.appointmentsService.update(id, updateAppointmentDto, req.user.id);
    }

    @Patch(':id/cancel')
    @ApiOperation({ summary: 'Cancel an appointment' })
    @ApiResponse({ status: 200, description: 'Appointment cancelled successfully', type: AppointmentResponseDto })
    async cancel(@Param('id') id: number, @Request() req) {
        return this.appointmentsService.cancel(id, req.user.id);
    }

    @Patch(':id/complete')
    @Roles(Role.VET)
    @ApiOperation({ summary: 'Mark an appointment as completed' })
    @ApiResponse({ status: 200, description: 'Appointment marked as completed', type: AppointmentResponseDto })
    async complete(@Param('id') id: number, @Request() req) {
        return this.appointmentsService.update(
            id,
            { status: AppointmentStatus.COMPLETED },
            req.user.id
        );
    }

    @Patch(':id/no-show')
    @Roles(Role.VET)
    @ApiOperation({ summary: 'Mark an appointment as no-show' })
    @ApiResponse({ status: 200, description: 'Appointment marked as no-show', type: AppointmentResponseDto })
    async markNoShow(@Param('id') id: number, @Request() req) {
        return this.appointmentsService.update(
            id,
            { status: AppointmentStatus.NO_SHOW },
            req.user.id
        );
    }

    @Patch(':id/in-progress')
    @Roles(Role.VET)
    @ApiOperation({ summary: 'Mark an appointment as in-progress' })
    @ApiResponse({ status: 200, description: 'Appointment marked as in-progress', type: AppointmentResponseDto })
    async markInProgress(@Param('id') id: number, @Request() req) {
        return this.appointmentsService.update(
            id,
            { status: AppointmentStatus.IN_PROGRESS },
            req.user.id
        );
    }
}