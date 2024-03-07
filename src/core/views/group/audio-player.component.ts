import {
  createSelectedTracks,
  numberOfPageSelectMenu,
} from '../selectMenu/selectMenu';
import { PlayerQueue } from '@/core/constants/index.constant';
import { MessageActionRow } from 'discord.js';
import { Player } from '@/core/models/player';
import {
  clearQueueComponent,
  nextSongComponent,
  pauseResumeComponent,
  prevSongComponent,
  removeAudioComponent,
  repeatComponent,
} from '../buttons';

export const AudioPlayerComponent = async (
  msg: any,
  player: Player,
  currentPage: number,
) => {
  return {
    components: [
      await createSelectedTracks(msg.tracks),
      await numberOfPageSelectMenu(
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
