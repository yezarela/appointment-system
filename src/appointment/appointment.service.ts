import { ForbiddenException, Injectable } from '@nestjs/common';
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
import { CreateAppointmentRequest } from './dto/requests/create-appointment.dto';
import { CreateAppointmentResponse } from './dto/responses/create-appointment.dto';
import { DAYS } from '../common/constants/days';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private configService: ConfigService<Config>,
  ) {}

  async listAppointments(date: string): Promise<AppointmentResponse[]> {
    const [opStartTime, opEndTime] = this.getOperationalTimes(date);

    // Find appointments that are within operational hours
    const appointments = await this.appointmentRepository.find({
      where: {
        startTime: Between(opStartTime, opEndTime),
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

  async createAppointment(
    body: CreateAppointmentRequest,
  ): Promise<CreateAppointmentResponse> {
    const slotDuration = this.configService.get<number>(
      'SLOT_DURATION_IN_MINUTES',
    );
    const maxSlotPerAppointment = this.configService.get<number>(
      'MAX_SLOT_PER_APPOINTMENT',
    );

    const operationalDays =
      this.configService.get<string[]>('OPERATIONAL_DAYS');

    const [opStartTime, opEndTime] = this.getOperationalTimes(body.date);

    const reqStartTime = new Date(`${body.date}T${body.time}`); // combine to local datetime
    const reqEndTime = new Date(reqStartTime);
    reqEndTime.setMinutes(reqEndTime.getMinutes() + slotDuration);
    const reqDay = DAYS[reqStartTime.getDay()];

    // Validate past startTime
    if (reqStartTime < new Date()) {
      throw new ForbiddenException('You cannot book for the past');
    }

    // Validate against operational days setting
    if (!operationalDays.includes(reqDay)) {
      throw new ForbiddenException('Out of operational day');
    }

    // Validate against operational hours setting
    if (reqStartTime < opStartTime || reqEndTime > opEndTime) {
      throw new ForbiddenException('Out of operational hours');
    }

    // Find appointments that are uses the same startTime
    const appointments = await this.appointmentRepository.find({
      where: {
        startTime: reqStartTime,
      },
    });

    // Compare with max slot setting
    if (appointments.length >= maxSlotPerAppointment) {
      throw new ForbiddenException('Slot already full');
    }

    const data = await this.appointmentRepository.create({
      fullName: body.full_name,
      email: body.email,
      startTime: reqStartTime,
      endTime: reqEndTime,
    });

    const res = await this.appointmentRepository.save(data);

    const [date, time] = parseDateAndTime(res.startTime);

    return {
      id: res.id,
      email: res.email,
      full_name: res.fullName,
      date,
      time,
    };
  }

  private getOperationalTimes(date: string): Date[] {
    // Parse operational hours to minutes
    const opStartMinutes = convertHHMMToMinutes(
      this.configService.get<string>('OPERATIONAL_HOUR_START'),
    );
    const opEndMinutes = convertHHMMToMinutes(
      this.configService.get<string>('OPERATIONAL_HOUR_END'),
    );

    // Construct operational start end time
    const opStartTime = new Date(`${date}T00:00`);
    opStartTime.setMinutes(opStartTime.getMinutes() + opStartMinutes);

    const opEndTime = new Date(`${date}T00:00`);
    opEndTime.setMinutes(opEndTime.getMinutes() + opEndMinutes);

    return [opStartTime, opEndTime];
  }
}
