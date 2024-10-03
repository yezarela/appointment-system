import { convertHHMMToMinutes, parseDateAndTime } from './time.util';

test('convertHHMMToMinutes should return valid minutes given valid time', () => {
  const res = convertHHMMToMinutes('09:00');
  expect(res).toEqual(540);
});

test('convertHHMMToMinutes should throw error given invalid time', () => {
  expect(() => {
    convertHHMMToMinutes('0900');
  }).toThrow('invalid time format');
});

test('parseDateAndTime should return valid result given valid time', () => {
  const res = parseDateAndTime(new Date('2024-09-09T09:00:00'));
  expect(res).toEqual(['2024-09-09', '09:00']);
});

test('parseDateAndTime should throw error given invalid time', () => {
  expect(() => {
    parseDateAndTime(null);
  }).toThrow('invalid datetime');
});
