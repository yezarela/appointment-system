import { plainToInstance, Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  validateSync,
} from 'class-validator';

export class Config {
  @IsNotEmpty()
  @IsNumber()
  SLOT_DURATION_IN_MINUTES: number;

  @IsNotEmpty()
  @IsNumber()
  MAX_SLOT_PER_APPOINTMENT: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsIn(
    [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ],
    { each: true },
  )
  @Transform(({ value }) => value.toString().split(',').map(String))
  OPERATIONAL_DAYS: string[];

  @IsNotEmpty()
  @IsMilitaryTime() // Checks if the string is in the format HH:MM.
  OPERATIONAL_HOUR_START: string;

  @IsNotEmpty()
  @IsMilitaryTime() // Checks if the string is in the format HH:MM.
  OPERATIONAL_HOUR_END: string;
}

// Validate config values against class-validator decorators
export function validateConfig(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(Config, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
