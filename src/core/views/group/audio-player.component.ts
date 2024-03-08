import {
  createSelectedTracks,
  numberOfPageSelectMenu,
} from '@/core/views/select-menu/selectMenu';
import { PlayerQueue } from '@/core/constants/index.constant';
import { MessageActionRow } from 'discord.js';
import { Player } from '@/core/models/player.model';
import {
  clearQueueComponent,
  nextSongComponent,
  pauseResumeComponent,
  prevSongComponent,
  removeAudioComponent,
  repeatComponent,
} from '../buttons';

export const AudioPlayerComponent = (
  msg: any,
  player: Player,
  currentPage: number,
) => {
  return {
    components: [
      createSelectedTracks(msg.tracks),
      numberOfPageSelectMenu(
        player.queue.length / PlayerQueue.MAX_PER_PAGE,
        currentPage,
      ),
      new MessageActionRow()
        .addComponents(prevSongComponent())
        .addComponents(pauseResumeComponent())
        .addComponents(nextSongComponent()),
      new MessageActionRow()
        .addComponents(clearQueueComponent())
        .addComponents(removeAudioComponent())
        .addComponents(repeatComponent()),
    ],
  };
};
