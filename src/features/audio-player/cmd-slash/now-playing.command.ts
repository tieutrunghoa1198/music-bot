import { AudioPlayerStatus } from '@discordjs/voice';
import { NotificationService } from '@/core/services/noti/notification';
import { Messages, players } from '@/core/constants/index.constant';
import { COMMAND_MUSIC } from '@/core/commands/music.command';

export default {
  data: COMMAND_MUSIC.nowPlaying.data,
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
