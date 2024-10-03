import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/config';
import { Appointment } from './model/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { AppointmentResponse } from './dto/responses/appointment.dto';
import {
  convertHHMMToMinutes,
  parseDateAndTime,
} from '../common/utils/time.util';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private configService: ConfigService<Config>,
  ) {}

  async listAppointments(date: string): Promise<AppointmentResponse[]> {
    // Parse operational hours to minutes
    const startMinutes = convertHHMMToMinutes(
      this.configService.get<string>('OPERATIONAL_HOUR_START'),
    );
    const endMinutes = convertHHMMToMinutes(
      this.configService.get<string>('OPERATIONAL_HOUR_END'),
    );

    // Construct start & end time based on operational hours config
    const startTime = new Date(date);
    startTime.setMinutes(startTime.getMinutes() + startMinutes);

    const endTime = new Date(date);
    endTime.setMinutes(endTime.getMinutes() + endMinutes);

    // Find appointments that are within operational hours
    const appointments = await this.appointmentRepository.find({
      where: {
        startTime: Between(startTime, endTime),
      },
    });

    // Map objects for response
    const result = appointments.map((e) => {
      const [date, time] = parseDateAndTime(e.startTime);
      return {
        date,
        time,
        available_slots: 1,
      };
    });

    return result;
  }
}
