import { Player } from '@/core/models/player.model';
import { InputType } from '@/core/types/input-type.type';
import { NotificationFactory } from '../noti/notification-factory';
import {
  classifyInteraction,
  classifyUrl,
  getRequester,
} from '@/core/utils/common.util';
import { Song } from '@/core/types/song.type';
import { MAP_LINK_TYPE } from '@/core/constants/player-service.constant';
import {
  createPlayer,
  enterReadyState,
} from '@/core/utils/player-service.util';

export class PlayerService {
  private readonly player: Player;
  private readonly interactionObj: any;
  private readonly userInputType: InputType;

  // -----------------------------

  constructor(interactionObj: any) {
    this.interactionObj = interactionObj;
    this.userInputType = classifyInteraction(interactionObj);
    this.player = createPlayer(interactionObj);
  }

  // ============================

  public async startPlay(input: string) {
    await enterReadyState(this.player);
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
}
