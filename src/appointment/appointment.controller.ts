import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { ListAppointmentQuery } from './dto/requests/list-appointment.dto';
import { AppointmentResponse } from './dto/responses/appointment.dto';
import { CreateAppointmentRequest } from './dto/requests/create-appointment.dto';
import { CreateAppointmentResponse } from './dto/responses/create-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('/')
  listAppointments(
    @Query() qs: ListAppointmentQuery,
  ): Promise<AppointmentResponse[]> {
    return this.appointmentService.listAppointments(qs.date);
  }

  @Post('/')
  createAppointment(
    @Body() body: CreateAppointmentRequest,
  ): Promise<CreateAppointmentResponse> {
    return this.appointmentService.createAppointment(body);
  }
}
