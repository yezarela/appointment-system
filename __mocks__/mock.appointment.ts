import { Appointment } from 'src/appointment/model/appointment.entity';

export const mockAppointment: Appointment = {
  startTime: new Date('2024-10-04T10:00:00'),
  endTime: new Date('2024-10-04T10:30:00'),
  email: 'foo@example.com',
  fullName: 'foo',
  id: 'some-id',
  isCancelled: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};
