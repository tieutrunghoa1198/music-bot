import { EmbedFieldData, MessageEmbed } from 'discord.js';
import * as Constant from '@/core/constants/index.constant';

export const createPlayMessage = (payload: {
  thumbnail: string;
  author: string;
  length: string;
  title: string;
  platform: string;
  guildName: string;
  icon: string;
}): MessageEmbed => {
  const author: EmbedFieldData = {
    name: Constant.Messages.author,
    value: payload.author,
    inline: true,
  };

  const length: EmbedFieldData = {
    name: Constant.Messages.length,
    value: `\`${payload.length}\``,
    inline: true,
  };

  const platform: EmbedFieldData = {
    name: Constant.Messages.platform,
    value: payload.platform,
    inline: true,
  };

  const requestedBy: EmbedFieldData = {
    name: Constant.Messages.requestedBy,
    value: 'Unknown',
  };

  return new MessageEmbed()
    .setTitle(payload.title)
    .setColor(0x99ff00)
    .setAuthor({
      name: `${payload.guildName} - Đang phát`,
      iconURL: payload.icon,
    })
    .addFields(author, platform, length, requestedBy);
};