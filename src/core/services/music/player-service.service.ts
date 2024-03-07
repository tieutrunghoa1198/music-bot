import {Player} from '@/core/models/player';
import {entersState, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus,} from '@discordjs/voice';
import {Client} from 'discord.js';
import {InputType} from '@/core/types/input-type.type';
import {NotificationFactory} from '../noti/notification-factory';
import {players} from '@/core/models/abstract-player.model';
import {classifyInteraction, classifyUrl, getRequester,} from '@/core/utils/common.util';
import {Song} from '@/core/types/song.type';
import {MAP_LINK_TYPE} from '@/core/constants/player-service.constant';
import {logger} from '@/core/utils/logger.util';

export class PlayerService {
  private readonly player: Player;
  private readonly interactionObj: any;
  private readonly userInputType: InputType;

  // -----------------------------

  constructor(interactionObj: any, client: Client) {
    this.interactionObj = interactionObj;
    this.userInputType = classifyInteraction(interactionObj);
    this.player = PlayerService.createPlayer(interactionObj, client);
  }

  // ============================

  public async startPlay(input: string) {
    await this.enterReadyState(this.player);
    await this.process(input);
  }

  private async process(inputLink: string) {
    const listSong = await this.getSongs(inputLink);

    this.playSong(listSong);
    this.showNotification(listSong);
  }

  // ============================

  private async getSongs(url: string): Promise<Song[]> {
    const getSong = MAP_LINK_TYPE.get(classifyUrl(url));
    let listSongs: Song[];

    getSong === undefined ? (listSongs = []) : (listSongs = await getSong(url));

    return listSongs;
  }

  private playSong(listSong: Song[]) {
    if (listSong.length === 0) return;

    this.player.addSong(
      listSong.map((song) => ({
        song,
        requester: getRequester(this.interactionObj),
      })),
    );
  }

  private showNotification(listSong: Song[]) {
    if (listSong.length === 0) {
      NotificationFactory.notifier(this.userInputType).defaultError(
        this.interactionObj,
      );
      return;
    }

    listSong.length === 1
      ? NotificationFactory.notifier(this.userInputType).showNowPlaying(
          this.player,
          this.interactionObj,
        )
      : NotificationFactory.notifier(this.userInputType).showQueue(
          this.player,
          this.interactionObj,
        );
  }

  private async enterReadyState(player: Player) {
    try {
      await entersState(
        <VoiceConnection>player?.voiceConnection,
        VoiceConnectionStatus.Ready,
        10e3,
      );
    } catch (e) {
      logger.error(e);
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
