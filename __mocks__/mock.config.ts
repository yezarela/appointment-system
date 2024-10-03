import { Config } from '../src/config';

export const mockConfig: Config = {
  SLOT_DURATION_IN_MINUTES: 30,
  MAX_SLOT_PER_APPOINTMENT: 1,
  OPERATIONAL_HOUR_START: '09:00',
  OPERATIONAL_HOUR_END: '18:00',
  OPERATIONAL_DAYS: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  UNAVAILABLE_HOURS: ['12:00'],
};
