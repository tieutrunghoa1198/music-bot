import { BuilderID } from '@/core/constants/index.constant';
import { Client } from 'discord.js';
import leaveCommand from '@/features/audio-player/cmd-slash/leave.command';

export default {
  customId: BuilderID.removeAudio,
  execute: async (interaction: any, client: Client) => {
    const message = await interaction.channel.messages.fetch(
      interaction.message.id,
    );
    message.delete().catch((error: any) => {
      // Only log the error if it is not an Unknown Message error
      if (error) {
        console.error('Failed to delete the message:', error);
        return;
      }
    });
    await leaveCommand.execute(interaction, client);
  },
};
