import { Snowflake } from 'discord-api-types/globals';
import { Player } from '@/core/models/player.model';

export const GlobalConstants = {
  defaultDeleteTime: 7500,
  specialSeparator: '/==|',
} as const;

export const players = new Map<Snowflake, Player>();
