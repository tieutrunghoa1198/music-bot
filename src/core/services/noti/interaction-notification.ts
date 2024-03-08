import { INotification } from '../../interfaces/notification.interface';
import { Player } from '@/core/models/player.model';
import { formatSeconds } from '@/core/utils/format-time.util';
import { AudioPlayerStatus } from '@discordjs/voice';
import { createPlayMessage } from '@/core/views/embed-messages/play.embed';
import { paginationMsg } from '@/core/views/embed-messages/queue.embed';
import * as Constant from '@/core/constants/index.constant';
import { AudioPlayerComponent } from '@/core/views/group/audio-player.component';
import { Song } from '@/core/types/song.type';

export class InteractionNotification implements INotification {
  private static instance: InteractionNotification;

  public static getInstance(): InteractionNotification {
    if (!InteractionNotification.instance) {
      InteractionNotification.instance = new InteractionNotification();
    }

    return InteractionNotification.instance;
  }

  public async showNowPlaying(player: Player, userInteraction: any) {
    if (userInteraction === undefined || null) {
      console.log('wrong here =========');
      return;
    }
    const guildName = userInteraction.member.guild.name;
    const icon = userInteraction.member.guild.iconURL();
    const song = player.queue[0].song;
    const payload = this.getNowPlayingPayload(song, guildName, icon);
    const message = await userInteraction.fetchReply();

    if (!message) {
      await userInteraction.deferUpdate();
      return;
    }

    if (
      player?.audioPlayer.state.status === AudioPlayerStatus.Playing &&
      player.queue.length > 0
    ) {
      await userInteraction.followUp(Constant.Messages.addedToQueue(payload));
      return;
    }

    await userInteraction.followUp({
      embeds: [createPlayMessage(payload)],
    });
  }

  public async showQueue(player: Player, userInteraction: any) {
    await userInteraction.followUp({
      embeds: [
        createPlayMessage(
          this.getNowPlayingPayload(
            player.playing?.song as Song,
            userInteraction.member.guild.name,
            userInteraction.member.guild.iconURL(),
          ),
        ),
      ],
      components: AudioPlayerComponent(
        await paginationMsg(player, 1),
        player,
        1,
      ).components,
    });
  }

  public async defaultError(userInteraction: any) {
    await userInteraction.followUp({ content: Constant.Messages.defaultError });
  }

  private getNowPlayingPayload = (
    song: Song,
    guildName: string,
    icon: string,
  ) => {
    console.log(song?.thumbnail);
    return {
      title: song?.title || 'Unknown',
      author: song?.author || 'Unknown',
      thumbnail: song?.thumbnail || 'Unknown',
      length: formatSeconds(song?.length) || 'Unknown',
      platform: song?.platform || 'Unknown',
      guildName,
      requester: 'Unknown',
      icon,
    };
  };
}
