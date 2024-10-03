import { Module } from '@nestjs/common';
import { AppointmentModule } from './appointment/appointment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment/model/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'appointment.sqlite',
      synchronize: false,
      entities: [Appointment],
      migrationsRun: false,
    }),
    AppointmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
