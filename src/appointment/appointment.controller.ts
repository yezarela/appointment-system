import { Controller, Get, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { ListAppointmentQuery } from './dto/requests/list-appointment.dto';
import { AppointmentResponse } from './dto/responses/appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('/')
  listAppointments(
    @Query() qs: ListAppointmentQuery,
  ): Promise<AppointmentResponse[]> {
    return this.appointmentService.listAppointments(qs.date);
  }
}
