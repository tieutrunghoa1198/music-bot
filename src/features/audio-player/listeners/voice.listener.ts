import { eventBus } from '@/core/utils/event-bus.util';
import { botClient } from '@/bot-client';
import { players } from '@/core/constants/common.constant';
import { logger } from '@/core/utils/logger.util';

const handleVoiceUpdate = (oldState: any, newState: any) => {
  if (oldState.member?.id !== botClient.user?.id) return;

  if (oldState.channelId && !newState.channelId) {
    logger.info(
      `Bot was disconnected from voice channel | GuildId: ${oldState.guild.id}!`,
    );
    const player = players.get(oldState.guild.id);
    if (player) player.leave();
  }
};

export const registerVoiceListener = () => {
  eventBus.on('voice:updated', handleVoiceUpdate);
};
