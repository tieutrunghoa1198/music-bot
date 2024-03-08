import { BuilderID, Messages, players } from '@/core/constants/index.constant';
import { Client } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';

export default {
  customId: BuilderID.pauseResume,
  execute: async (interaction: any, client: Client) => {
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
