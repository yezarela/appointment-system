import { Expose } from 'class-transformer';

export class CreateAppointmentResponse {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  full_name: string;

  @Expose()
  date: string;

  @Expose()
  time: string;
}
