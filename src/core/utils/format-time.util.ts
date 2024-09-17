import moment from 'moment';
import { MAP_TIME_FORMAT, TIME_FORMAT } from '@/core/constants/time.constant';
import { EMPTY_HYPHEN, EMPTY_STRING } from '@/core/constants/common.constant';

export const formatSeconds = (seconds: number): string => {
  return moment
    .utc(seconds * 1000)
    .format(seconds > 3600 ? 'HH:mm:ss' : 'mm:ss');
};

export const codeBlockText = (content: string) => {
  return `\`${content}\``;
};

export const boldText = (content: string) => {
  return `\*\*${content}\*\*`;
};

/**
 * @desc Convert user input (time) to number of seconds
 * @param input
 */
export const formatTimeInput = (input: string): number | null => {
  const numberOfColon = input.split(':').length - 1;
  const formatType = MAP_TIME_FORMAT.get(numberOfColon);

  return formatType
    ? moment
        .duration(moment(input, formatType).format(TIME_FORMAT.HH_MM_SS))
        .asSeconds()
    : null;
};

export const isValidTimeInput = (input: string): boolean => {
  if (!input) return false;

  // handle those cases are not include ':'
  if (
    !input.includes(':') &&
    (isNaN(Number(input)) || // is not a number and not include ':' -> reject
      (!isNaN(Number(input)) && Number(input) > 59) || // is number, not include ':' and greater than 59 seconds -> reject
      !Number.isInteger(input)) // input is not an integer
  )
    return false;

  // this case make sure all number in dd::HH:mm:ss are all valid number (is integer number & must be a number)
  const isValidNumberArray = input.split(':').every(
    (item) =>
      !isNaN(Number(item === EMPTY_STRING ? EMPTY_HYPHEN : item)) && // make sure they are all number
      Number.isInteger(item === EMPTY_STRING ? EMPTY_HYPHEN : item), // make sure they are all integer
  );

  const isValidTime = input
    .split(':')
    .reverse()
    .every((item, index) => {
      switch (index) {
        case 0: // second
        case 1: {
          // minute
          return Number(item) < 60; // less than 60 seconds or minutes
        }
        case 2: {
          // hour
          return Number(item) < 24; // less than 24 hours
        }
        case 3: {
          // day
          return Number(item) < 31; // less than 31 days
        }
      }
    });

  return !(input.includes(':') && !isValidNumberArray && !isValidTime);
};
