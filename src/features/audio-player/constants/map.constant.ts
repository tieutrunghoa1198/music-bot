import { recordSelectMenu } from '@/features/audio-player/select-menus/record.selectmenu';
import { trackSelectMenu } from '@/features/audio-player/select-menus/track.selectmenu';

// ---------------------------------

const SELECT_MENU_AUDIO_PLAYER = [recordSelectMenu, trackSelectMenu];

export const SELECT_MENU_AUDIO_PLAYER_MAP = new Map(
  SELECT_MENU_AUDIO_PLAYER.map((data) => [data.customId, data]),
);

// ---------------------------------

const BUTTON_AUDIO_PLAYER = [];

export const BUTTON_AUDIO_PLAYER_MAP = [];

// ================================

const SLASH_AUDIO_PLAYER = [];
