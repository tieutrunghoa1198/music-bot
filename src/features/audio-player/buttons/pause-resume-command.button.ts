import { BuilderID, Messages, players } from '@/core/constants/index.constant';
import { AudioPlayerStatus } from '@discordjs/voice';
import { IButtonCommand } from '@/core/interfaces/command.interface';

export const pauseResumeCommandButton: IButtonCommand = {
  customId: BuilderID.pauseResume,
  execute: async (interaction: any) => {
    await interaction.deferReply();

    const player = players.get(interaction.guildId as string);
    if (!player) {
      await interaction.followUp(Messages.joinVoiceChannel);
      return;
    }
    if (player.audioPlayer.state.status === AudioPlayerStatus.Playing) {
      player.pause();
      await interaction.followUp(Messages.paused);
      return;
    }
    if (player.audioPlayer.state.status === AudioPlayerStatus.Paused) {
      player.resume();
      await interaction.followUp(Messages.resumed);
      return;
    }
    await interaction.followUp(Messages.notPlaying);
  },
};
