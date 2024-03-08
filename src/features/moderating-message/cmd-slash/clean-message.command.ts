import { Client, TextChannel } from 'discord.js';
import { COMMAND_MODERATING_MESSAGE } from '@/core/commands/moderating-message.command';

export default {
  data: COMMAND_MODERATING_MESSAGE.cleanMessage.data,
  execute: async function (interaction: any, client: Client) {
    await interaction.deferReply();

    const textChannelId = interaction.channelId;
    const textChannel: TextChannel = client.channels.cache.get(
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
            console.log('[ERROR] clean unknown msg' + err);
            return;
          });
        }
      }
    });
  },
};
