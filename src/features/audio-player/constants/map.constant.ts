import { recordSelectMenu } from '@/features/audio-player/views/select-menus/record.selectmenu';
import { trackSelectMenu } from '@/features/audio-player/views/select-menus/track.selectmenu';
import { clearQueueCommandButton } from '@/features/audio-player/views/buttons/clear-queue-command.button';
import { nextPageCommandButton } from '@/features/audio-player/views/buttons/next-page-command.button';
import { nextSongCommandButton } from '@/features/audio-player/views/buttons/next-song-command.button';
import { pauseResumeCommandButton } from '@/features/audio-player/views/buttons/pause-resume-command.button';
import { previousPageCommandButton } from '@/features/audio-player/views/buttons/previous-page-command.button';
import { removeAudioCommandButton } from '@/features/audio-player/views/buttons/remove-audio-command.button';
import { repeatCommandButton } from '@/features/audio-player/views/buttons/repeat-command.button';

// ---------------------------------

const SELECT_MENU_AUDIO_PLAYER = [recordSelectMenu, trackSelectMenu];

export const SELECT_MENU_AUDIO_PLAYER_MAP = new Map(
  SELECT_MENU_AUDIO_PLAYER.map((data) => [data.customId, data]),
);

// ---------------------------------

const BUTTON_AUDIO_PLAYER = [
  clearQueueCommandButton,
  nextPageCommandButton,
  nextSongCommandButton,
  pauseResumeCommandButton,
  previousPageCommandButton,
  removeAudioCommandButton,
  repeatCommandButton,
];

export const BUTTON_AUDIO_PLAYER_MAP = new Map(
  BUTTON_AUDIO_PLAYER.map((data) => [data.customId, data]),
);
