import { TextChannel } from 'discord.js';
import { ISlashCommand } from '@/core/interfaces/command.interface';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ExpCommands } from '@/core/constants/music-commands.constant';
import { botClient } from '@/bot-client';
import { logger } from '@/core/utils/logger.util';

export const cleanMessageCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName(ExpCommands.cleanMessage.name)
    .setDescription(ExpCommands.cleanMessage.description)
    .setDMPermission(false),
  execute: async function (interaction: any) {
    await interaction.deferReply();

    const textChannelId = interaction.channelId;
    const textChannel: TextChannel = botClient.channels.cache.get(
      textChannelId,
    ) as TextChannel;
    const recentMessages = await textChannel.messages.fetch({ limit: 90 });
    if (!recentMessages) {
      console.log('cannot get recent message');
      return;
    }
    recentMessages.forEach((message: any) => {
      if (message === null || message === undefined) {
        return;
      }
      if (message.author.bot && message.deletable) {
        const currentDate = Date.now();
        const twoHoursInMsc = 1000 * 60 * 60 * 2;
        if (currentDate - twoHoursInMsc < message.createdTimestamp) {
          message.delete().catch((err: any) => {
            logger.error('[ERROR] clean unknown msg' + err);
            return;
          });
        }
      }
    });
  },
};
