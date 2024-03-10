import { AudioPlayerStatus } from '@discordjs/voice';
import {
  Messages,
  MusicCommands,
  players,
} from '@/core/constants/index.constant';
import { ISlashCommand } from '@/core/interfaces/command.interface';
import { SlashCommandBuilder } from '@discordjs/builders';

export const resumeCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName(MusicCommands.resume.name)
    .setDescription(MusicCommands.resume.description)
    .setDMPermission(false),
  async execute(interaction: any) {
    await interaction.deferReply();

    const player = players.get(interaction.guildId as string);
    if (!player) {
      await interaction.followUp(Messages.joinVoiceChannel);
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
