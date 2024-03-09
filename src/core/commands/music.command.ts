import { clearQueueCommand } from '@/features/audio-player/cmd-slash/clear-queue.command';
import { leaveCommand } from '@/features/audio-player/cmd-slash/leave.command';
import { nowPlayingCommand } from '@/features/audio-player/cmd-slash/now-playing.command';
import { pauseCommand } from '@/features/audio-player/cmd-slash/pause.command';
import { playCommand } from '@/features/audio-player/cmd-slash/play.command';
import { replayCommand } from '@/features/audio-player/cmd-slash/replay.command';
import { resumeCommand } from '@/features/audio-player/cmd-slash/resume.command';
import { showListCommand } from '@/features/audio-player/cmd-slash/show-list.command';
import { skipCommand } from '@/features/audio-player/cmd-slash/skip.command';

export const MusicCommand = {
  clearQueueCommand,
  leaveCommand,
  nowPlayingCommand,
  pauseCommand,
  playCommand,
  replayCommand,
  resumeCommand,
  showListCommand,
  skipCommand,
};

export const MUSIC_COMMAND_MAP = new Map(
  Object.entries(MusicCommand).map(([key, value]) => [value.data.name, value]),
);
