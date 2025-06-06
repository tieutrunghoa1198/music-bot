import { Snowflake } from 'discord-api-types/globals';
import { Player } from '@/core/services/player.service';

export const GlobalConstants = {
  defaultDeleteTime: 7500,
  specialSeparator: '/==|',
} as const;

export const players = new Map<Snowflake, Player>();

export const EMPTY_STRING = '' as const;
export const EMPTY_HYPHEN = '-' as const;
