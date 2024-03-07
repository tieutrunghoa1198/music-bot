import {EmbedFieldData, MessageEmbed} from 'discord.js';
import {Player} from '@/core/models/player';
import {boldText, codeBlockText, formatSeconds,} from '@/core/utils/format-time.util';
import * as Constant from '@/core/constants/index.constant';
import {QueueItem} from '@/core/models/abstract-player.model';

export const paginationMsg = async (
  player: Player,
  currentPage: number,
): Promise<any> => {
  const { MAX_PER_PAGE } = Constant.PlayerQueue;
  const queueLength = player.queue.length;
  const numberOfPages = Math.ceil(queueLength / MAX_PER_PAGE);
  const currentList: QueueItem[] = [];
  const msg = new MessageEmbed();
  if (currentPage > numberOfPages || currentPage <= 0) {
    return null;
  }
  msg.setTitle(`:notes: Danh sách hiện tại | ${queueLength} bài hát`);
  msg.setColor(0x99ff00);
  for (let i = 0; i < MAX_PER_PAGE; i++) {
    const songIndex = MAX_PER_PAGE * (currentPage - 1) + i;
    if (songIndex >= player.queue.length) {
      break;
    }
    const song = player.queue[songIndex].song;
    currentList.push(player.queue[songIndex]);
    const songObj: EmbedFieldData = {
      name: `${codeBlockText((songIndex + 1).toString())} | (${codeBlockText(formatSeconds(song.length))}) ${boldText(song.title)} - khoidaumoi`,
      value: '** **',
    };
    await msg.addFields(songObj);
  }
  msg.setFooter({
    text: `Trang: ${currentPage}/${numberOfPages}`,
    iconURL: 'https://i.imgur.com/AfFp7pu.png',
  });
  return {
    embedMessage: msg,
    tracks: currentList,
  };
};
