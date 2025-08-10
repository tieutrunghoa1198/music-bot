import { Message } from 'discord.js';
import { eventBus } from '@/core/utils/event-bus.util';
import { RestrictChannelRepository } from '@/core/database/repositories/restrict-channel.repository';

const restrictChannelRepository = new RestrictChannelRepository();

const restrict = async (msg: Message) => {
  if (!msg.guildId) return;
  const guild = await restrictChannelRepository.findByGuildId(msg.guildId);
  if (!guild) return;
  let selectedChannel: any;
  guild.restrictChannels.forEach((element: any) => {
    if (element.channelId.toString() === msg.channelId.toString()) {
      selectedChannel = element;
      return;
    }
  });

  const role = msg.member?.roles.cache.get(selectedChannel?.roleId);

  if (msg.deletable && !role && selectedChannel?.channelId) {
    await msg.delete().catch((error) => {
      // Only log the error if it is not an Unknown Message error
      if (error) {
        console.error('Failed to delete the message:', error);
        return;
      }
    });
  }
};

export const registerMessageRestrictListener = () => {
  eventBus.on('message:created', restrict);
};
