import { EmbedFieldData, MessageEmbed } from 'discord.js';
import { Messages } from '@/core/constants/messages.constant';

export const AddSongMessage = (payload: any) => {
  const author: EmbedFieldData = {
    name: Messages.platform,
    value: payload.platform,
    inline: true,
  };

  return new MessageEmbed()
    .setTitle(payload.title)
    .setColor(0x99ff00)
    .setAuthor({
      name: `${payload.guildName} - Đang phát`,
      iconURL: payload.icon,
    })
    .setThumbnail(payload.thumbnail)
    .addFields(author);
};
