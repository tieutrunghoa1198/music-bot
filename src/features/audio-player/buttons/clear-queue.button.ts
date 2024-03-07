import { BuilderID } from '@/core/constants/music-commands.constant';
import { Client } from 'discord.js';
import clearQueueCommand from '@/features/audio-player/cmd-slash/clear-queue.command';

export default {
  customId: BuilderID.clearQueue,
  execute: async (interaction: any, client: Client) =>
    clearQueueCommand.execute(interaction, client),
};
