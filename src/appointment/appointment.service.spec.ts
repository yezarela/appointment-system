import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppointmentService } from './appointment.service';
import { Repository } from 'typeorm';
import { ForbiddenException } from '@nestjs/common';
import { Appointment } from './model/appointment.entity';
import { mockConfig, mockRepository, mockAppointment } from '../../__mocks__';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let config: ConfigService;
  let appointmentRepository: Repository<Appointment>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [() => mockConfig] })],
      providers: [
        AppointmentService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
    config = module.get<ConfigService>(ConfigService);
    appointmentRepository = module.get<Repository<Appointment>>(
      getRepositoryToken(Appointment),
    );
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  it('all services should be defined', () => {
    expect(service).toBeDefined();
    expect(config).toBeDefined();
    expect(appointmentRepository).toBeDefined();
  });

  describe('createAppointment', () => {
    Object.defineProperty(global, 'performance', {
      writable: true,
    });
    jest.useFakeTimers().setSystemTime(new Date('2024-10-03'));

    it('should return error given past date', async () => {
      const expectedError = new ForbiddenException(
        'You cannot book for the past',
      );

      await expect(
        service.createAppointment({
          date: '2020-09-09',
          time: '10:00',
          email: 'foo@example.com',
          full_name: 'foo',
        }),
      ).rejects.toThrow(expectedError);
    });

    it('should return error given out of operational date', async () => {
      const expectedError = new ForbiddenException('Out of operational day');

      await expect(
        service.createAppointment({
          date: '2024-10-05',
          time: '10:00',
          email: 'foo@example.com',
          full_name: 'foo',
        }),
      ).rejects.toThrow(expectedError);
    });

    it('should return error given out of operational hour', async () => {
      const expectedError = new ForbiddenException('Out of operational hours');

      await expect(
        service.createAppointment({
          date: '2024-10-04',
          time: '19:00',
          email: 'foo@example.com',
          full_name: 'foo',
        }),
      ).rejects.toThrow(expectedError);
    });

    it('should return error given fully booked date', async () => {
      const findSpy = jest
        .spyOn(appointmentRepository, 'find')
        .mockResolvedValueOnce([mockAppointment]);

      const expectedError = new ForbiddenException('Slot already full');

      await expect(
        service.createAppointment({
          date: '2024-10-04',
          time: '10:00',
          email: 'foo@example.com',
          full_name: 'foo',
        }),
      ).rejects.toThrow(expectedError);

      expect(findSpy).toBeCalledTimes(1);
    });
  });
});
