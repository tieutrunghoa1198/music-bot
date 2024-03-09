import { INotification } from '../../interfaces/notification.interface';
import { formatSeconds } from '@/core/utils/format-time.util';
import { AudioPlayerStatus } from '@discordjs/voice';
import { createPlayMessage } from '@/core/views/embed-messages/play.embed';
import { paginationMsg } from '@/core/views/embed-messages/queue.embed';
import * as Constant from '@/core/constants/index.constant';
import { Messages, players } from '@/core/constants/index.constant';
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

  public async showNowPlaying(userInteraction: any) {
    if (userInteraction === undefined || null) {
      console.log('wrong here =========');
      return;
    }

    const player = players.get(userInteraction.guildId as string);
    if (!player) {
      await userInteraction.followUp(Messages.playerNotCreated);
      return;
    }
    // done check condition

    const payload = this.getNowPlayingPayload(
      player.playing?.song,
      userInteraction.member.guild.name,
      userInteraction.member.guild.iconURL(),
    );

    if (!(await userInteraction.fetchReply())) {
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

  public async showQueue(userInteraction: any) {
    const player = players.get(userInteraction.guildId as string);
    if (!player) {
      await userInteraction.followUp(Messages.playerNotCreated);
      return;
    }

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
    song: Song | undefined,
    guildName: string,
    icon: string,
  ) => {
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
  };
}
