import { formatSeconds } from '@/core/utils/format-time.util';
import { AudioPlayerStatus } from '@discordjs/voice';
import { createPlayMessage } from '@/core/views/embed-messages/play.embed';
import * as Constant from '@/core/constants/index.constant';
import { Messages, players } from '@/core/constants/index.constant';
import { INotification } from '../../interfaces/notification.interface';
import { paginationMsg } from '@/core/views/embed-messages/queue.embed';
import { AudioPlayerComponent } from '@/core/views/group/audio-player.component';
import { Song } from '@/core/types/song.type';

export class MessageNotification implements INotification {
  private static instance: MessageNotification;

  public static getInstance(): MessageNotification {
    if (!MessageNotification.instance) {
      MessageNotification.instance = new MessageNotification();
    }
    return MessageNotification.instance;
  }

  public async showNowPlaying(userInteraction: any) {
    const player = players.get(userInteraction.guildId as string);
    if (!player) {
      await userInteraction.followUp(Messages.playerNotCreated);
      return;
    }

    const payload = this.getNowPlayingPayload(
      player.playing?.song,
      userInteraction.member?.guild.name as string,
      userInteraction.member?.guild.iconURL() as string,
    );

    if (
      player?.audioPlayer.state.status === AudioPlayerStatus.Playing &&
      player.queue.length > 0
    ) {
      await userInteraction.channel.send(
        Constant.Messages.addedToQueue(payload),
      );
      return;
    }

    await userInteraction.channel.send({
      embeds: [createPlayMessage(payload)],
    });
  }

  public async showQueue(userInteraction: any) {
    const player = players.get(userInteraction.guildId as string);
    if (!player) {
      await userInteraction.followUp(Messages.playerNotCreated);
      return;
    }

    await userInteraction.channel.send({
      embeds: [
        createPlayMessage(
          this.getNowPlayingPayload(
            player.playing?.song as Song,
            userInteraction.member?.guild.name as string,
            userInteraction.member?.guild.iconURL() as string,
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
    await userInteraction.channel.send(
      'Token might be expired, or cannot get song.',
    );
  }

  private getNowPlayingPayload(
    song: Song | undefined,
    guildName: string,
    icon: string,
  ) {
    return {
      title: song?.title || 'Unknown',
      author: song?.author || 'Unknown',
      thumbnail: song?.thumbnail || 'Unknown',
      length: formatSeconds(song?.length || 0) || 'Unknown',
      platform: song?.platform || 'Unknown',
      guildName,
      requester: 'Unknown',
      icon,
    };
  }
}
