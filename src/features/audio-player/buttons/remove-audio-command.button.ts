import { BuilderID } from '@/core/constants/index.constant';
import { leaveCommand } from '@/features/audio-player/cmd-slash/leave.command';
import { IButtonCommand } from '@/core/interfaces/command.interface';

export const removeAudioCommandButton: IButtonCommand = {
  customId: BuilderID.removeAudio,
  execute: async (interaction: any) => {
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
    await leaveCommand.execute(interaction);
  },
};
