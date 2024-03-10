import { BuilderID } from '@/core/constants/music-commands.constant';
import { logger } from '@/core/utils/logger.util';
import { clearQueueCommand } from '@/features/audio-player/cmd-slash/clear-queue.command';
import { IButtonCommand } from '@/core/interfaces/command.interface';

export const clearQueueCommandButton: IButtonCommand = {
  customId: BuilderID.clearQueue,
  execute: async (interaction: any) => {
    await interaction.deferReply();
    clearQueueCommand.execute(interaction).catch((e) => logger.error(e));
  },
};
