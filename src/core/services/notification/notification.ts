import { createPlayMessage } from '@/core/views/embed-messages/play.embed';
import { Player } from '@/core/services/audio-player/player.service';
import { formatSeconds } from '@/core/utils/format-time.util';
import { QueueItem } from '@/core/interfaces/player.interface';

export class NotificationService {
  public static async nowPlaying(player: Player, interaction: any) {
    if (interaction === undefined || null) {
      return;
    }
    const queueItem: QueueItem = player.queueManager.currentSong as QueueItem;
    const guildName = interaction.member.guild.name;
    const icon = interaction.member.guild.iconURL();
    const song = queueItem.song;

    const payload = {
      title: song.title,
      author: song.author,
      thumbnail: song.thumbnail,
      length: formatSeconds(song.length),
      platform: song.platform,
      guildName,
      requester: queueItem.requester,
      icon,
    };
    await interaction.followUp({ embeds: [createPlayMessage(payload)] });
  }
}
