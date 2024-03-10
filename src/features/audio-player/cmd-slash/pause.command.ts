import { AudioPlayerStatus } from '@discordjs/voice';
import {
  Messages,
  MusicCommands,
  players,
} from '@/core/constants/index.constant';
import { ISlashCommand } from '@/core/interfaces/command.interface';
import { SlashCommandBuilder } from '@discordjs/builders';

export const pauseCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName(MusicCommands.pause.name)
    .setDescription(MusicCommands.pause.description)
    .setDMPermission(false),
  async execute(interaction: any) {
    await interaction.deferReply();

    const player = players.get(interaction.guildId as string);
    if (!player?.voiceConnection) {
      await interaction.followUp(Messages.joinVoiceChannel);
      return;
    }
    if (player.audioPlayer.state.status === AudioPlayerStatus.Playing) {
      player.pause();
      await interaction.followUp(Messages.paused);
      return;
    }
    await interaction.followUp(Messages.notPlaying);
  },
};
