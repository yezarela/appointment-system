import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/config';

@Injectable()
export class AppointmentService {
  constructor(private config: ConfigService<Config>) {
    console.log('ops', this.config.get('OPERATIONAL_DAYS'));
  }
}
