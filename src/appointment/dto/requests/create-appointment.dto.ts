import {
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateAppointmentRequest {
  @IsString()
  @IsNotEmpty()
  readonly full_name: string;

  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @IsDateString()
  readonly date: string;

  @IsMilitaryTime()
  @IsNotEmpty()
  readonly time: string;
}
