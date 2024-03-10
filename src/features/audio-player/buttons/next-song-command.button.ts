import { BuilderID } from '@/core/constants/music-commands.constant';
import { logger } from '@/core/utils/logger.util';
import { skipCommand } from '@/features/audio-player/cmd-slash/skip.command';
import { IButtonCommand } from '@/core/interfaces/command.interface';

export const nextSongCommandButton: IButtonCommand = {
  customId: BuilderID.nextSong,
  execute: async (interaction: any) => {
    skipCommand.execute(interaction).catch((e) => logger.error(e));
  },
};
