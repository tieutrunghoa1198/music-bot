import { Player } from '@/core/models/player';
import {
  entersState,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { Client } from 'discord.js';
import * as Constant from '@/core/constants/index.constant';
import { SoundCloudService } from './soundcloud.service';
import { InputType } from '@/core/types/input-type.type';
import { YoutubeService } from './youtube.service';
import { NotificationFactory } from '../noti/notification-factory';
import { players } from '@/core/models/abstract-player.model';
import {
  classifyInteraction,
  classifyUrl,
  getRequester,
} from '@/core/utils/common.util';

export class PlayerService {
  private readonly player: Player;
  private readonly interactionObj: any;
  private readonly userInputType: InputType;

  constructor(interactionObj: any, client: Client) {
    this.interactionObj = interactionObj;
    this.userInputType = classifyInteraction(interactionObj);
    this.player = PlayerService.createPlayer(interactionObj, client);
  }

  public async startPlay(input: string) {
    await this.enterReadyState(this.player);
    await this.process(
      input,
      await classifyUrl(input),
      getRequester(this.interactionObj),
    );
  }

  private async process(
    inputLink: string,
    linkType: Constant.Link,
    requester: string,
  ) {
    switch (linkType) {
      case Constant.Link.YoutubeTrack:
        const song = await YoutubeService.getVideoDetail(inputLink);

        await this.player?.addSong([
          {
            song,
            requester: requester as string,
          },
        ]);

        NotificationFactory.notifier(this.userInputType).showNowPlaying(
          this.player,
          this.interactionObj,
          {
            song,
            requester: requester as string,
          },
        );
        break;
      case Constant.Link.YoutubeRandomList:
        const listTrack = await YoutubeService.getRandomList(inputLink);

        await this.player?.addSong(
          listTrack.songs.map((song) => ({
            song,
            requester: requester as string,
          })),
        );

        NotificationFactory.notifier(this.userInputType).showQueue(
          this.interactionObj,
          this.player,
        );
        break;
      case Constant.Link.SoundCloudTrack:
        const track = await SoundCloudService.getTrackDetail(inputLink);

        await this.player.addSong([
          {
            song: track,
            requester: requester as string,
          },
        ]);

        NotificationFactory.notifier(this.userInputType).showNowPlaying(
          this.player,
          this.interactionObj,
          {
            song: track,
            requester: requester as string,
          },
        );
        break;
      case Constant.Link.Empty:
        NotificationFactory.notifier(this.userInputType).defaultError(
          this.interactionObj,
        );
        break;
    }
  }

  private async enterReadyState(player: Player) {
    try {
      await entersState(
        <VoiceConnection>player?.voiceConnection,
        VoiceConnectionStatus.Ready,
        10e3,
      );
    } catch (e) {
      console.log(e);
    }
  }

  private static createPlayer(interactObj: any, client: Client) {
    let player = players.get(interactObj.guildId as string) as Player;

    if (player) return player;

    const channel = interactObj.member.voice.channel;
    player = new Player(
        joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        }),
        interactObj.guildId as string,
        client,
    );
    players.set(interactObj.guildId as string, player);
    return player;

  }
}
