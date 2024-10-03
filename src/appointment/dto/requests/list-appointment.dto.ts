import { IsDateString } from 'class-validator';

export class ListAppointmentQuery {
  @IsDateString()
  date: string;
}
