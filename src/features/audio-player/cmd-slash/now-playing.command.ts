import { AudioPlayerStatus } from '@discordjs/voice';
import { NotificationService } from '@/core/services/noti/notification';
import {
  Messages,
  MusicCommands,
  players,
} from '@/core/constants/index.constant';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ISlashCommand } from '@/core/interfaces/command.interface';

export const nowPlayingCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName(MusicCommands.nowPlaying.name)
    .setDescription(MusicCommands.nowPlaying.description)
    .setDMPermission(false),
  async execute(interaction: any) {
    await interaction.deferReply();

    const player = players.get(interaction.guildId as string);
    if (!player) {
      await interaction.followUp(Messages.joinVoiceChannel);
      return;
    }
    if (!player.playing) {
      await interaction.followUp(Messages.notPlaying);
      return;
    }
    if (player.audioPlayer.state.status === AudioPlayerStatus.Playing) {
      await NotificationService.nowPlaying(player, interaction);
      return;
    }
    await interaction.followUp(Messages.notPlaying);
  },
};
