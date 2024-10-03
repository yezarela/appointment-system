import { Expose } from 'class-transformer';

export class AppointmentResponse {
  @Expose()
  date: string;

  @Expose()
  time: string;

  @Expose()
  available_slots: number;
}
