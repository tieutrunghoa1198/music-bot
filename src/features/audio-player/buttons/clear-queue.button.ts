import { BuilderID } from '@/core/constants/music-commands.constant';
import clearQueueCommand from '@/features/audio-player/cmd-slash/clear-queue.command';
import { logger } from '@/core/utils/logger.util';

export default {
  customId: BuilderID.clearQueue,
  execute: async (interaction: any) => {
    await interaction.deferReply();
    clearQueueCommand.execute(interaction).catch((e) => logger.error(e));
  },
};
