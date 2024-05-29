import { ObjectValues } from '@/core/types/common.types';

export const TIME_FORMAT = {
  SS: 'ss',
  MM_SS: 'mm:ss',
  HH_MM_SS: 'HH:mm:ss',
  DD_HH_MM_SS: 'DD:HH:mm:ss',
};

export type tTimeFormat = ObjectValues<typeof TIME_FORMAT>;

export const MAP_TIME_FORMAT = new Map<number, tTimeFormat>([
  [0, TIME_FORMAT.SS],
  [1, TIME_FORMAT.MM_SS],
  [2, TIME_FORMAT.HH_MM_SS],
  [3, TIME_FORMAT.DD_HH_MM_SS],
]);
