import { format } from 'date-fns';

export function convertHHMMToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  if (hours === undefined || minutes === undefined) {
    throw new Error('invalid time format');
  }

  return hours * 60 + minutes;
}

export function parseDateAndTime(date: Date): string[] {
  if (!date) {
    throw new Error('invalid datetime');
  }

  const formattedDate = format(date, 'yyyy-MM-dd');
  const formattedTime = format(date, 'HH:mm');

  return [formattedDate, formattedTime];
}
