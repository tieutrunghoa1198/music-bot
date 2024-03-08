import {
  AudioPlayer,
  AudioPlayerState,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  VoiceConnection,
  VoiceConnectionDisconnectReason,
  VoiceConnectionState,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import play from 'play-dl';
import { Client } from 'discord.js';
import { IPlayer, QueueItem } from '@/core/interfaces/player.interface';
import { players } from '@/core/constants/common.constant';
import { logger } from '@/core/utils/logger.util';

export class Player implements IPlayer {
  public guildId: string;
  public playing: QueueItem | undefined;
  public queue: QueueItem[];
  public readonly voiceConnection: VoiceConnection;
  public readonly audioPlayer: AudioPlayer;
  private client: Client;
  private _isReplay: boolean = false;

  // -----------------------------

  constructor(
    voiceConnection: VoiceConnection,
    guildId: string,
    client: Client,
  ) {
    this.voiceConnection = voiceConnection;
    this.guildId = guildId;
    this.queue = [];
    this.playing = undefined;
    this.audioPlayer = createAudioPlayer();
    this.client = client;
    this.voiceStateChange();
    this.audioStateChange();
    voiceConnection.subscribe(this.audioPlayer);
  }

  get isReplay(): boolean {
    return <boolean>this._isReplay;
  }

  set isReplay(value: boolean) {
    this._isReplay = value;
  }

  // -----------------------------

  // todo: it's your challenge to understand this then convert to a simpler version
  private voiceStateChange() {
    this.voiceConnection.on(
      'stateChange',
      async (
        oldState: VoiceConnectionState,
        newState: VoiceConnectionState,
      ) => {
        if (
          oldState.status === VoiceConnectionStatus.Ready &&
          newState.status === VoiceConnectionStatus.Connecting
        )
          this.voiceConnection.configureNetworking();

        if (newState.status === VoiceConnectionStatus.Disconnected) {
          /*
                  Nếu websocket đã bị đóng với mã 4014 có 2 khả năng:
                  - Nếu nó có khả năng tự kết nối lại (có khả năng do chuyển kênh thoại),
                    cho 5s để reconnect.
                  - Nếu bot bị kick khỏi kênh thoại, ta sẽ phá huỷ kết nối.
				*/
          if (
            newState.reason ===
              VoiceConnectionDisconnectReason.WebSocketClose &&
            newState.closeCode === 4014
          ) {
            await this.enterState(
              VoiceConnectionStatus.Connecting,
              5_000,
              (error) => {
                this.leave();
                logger.error(
                  'VoiceConnectionDisconnectReason.WebSocketClose at voiceStateChange() error',
                  error,
                );
              },
            );
          }
          if (this.voiceConnection.rejoinAttempts < 5)
            this.voiceConnection.rejoin();
          if (this.voiceConnection.rejoinAttempts >= 5) this.leave();
        }

        if (newState.status === VoiceConnectionStatus.Destroyed) this.leave();

        if (
          newState.status === VoiceConnectionStatus.Connecting ||
          newState.status === VoiceConnectionStatus.Signalling
        ) {
          await this.enterState(
            VoiceConnectionStatus.Ready,
            20_000,
            (error) => {
              if (
                this.voiceConnection.state.status !==
                VoiceConnectionStatus.Destroyed
              )
                this.voiceConnection.destroy();

              logger.error(
                'VoiceConnectionStatus.Signalling at voiceStateChange() error',
                error,
              );
            },
          );
        }

      },
    );

  }

  private audioStateChange() {
    this.audioPlayer.on(
      'stateChange',
      async (oldState: AudioPlayerState, newState: AudioPlayerState) => {
        if (
          newState.status === AudioPlayerStatus.Idle &&
          oldState.status !== AudioPlayerStatus.Idle
        ) {
          await this.play(); // if stay here means play next song
          this.client.emit('nextSong', {
            nextSong: this.playing as QueueItem,
            guildId: this.guildId,
          });
        }
      },
    );
  }

  private async enterState(
    status: VoiceConnectionStatus,
    timeout: AbortSignal | number,
    callBack: (error: any) => void,
  ) {
    try {
      await entersState(this.voiceConnection, status, timeout);
    } catch (e) {
      callBack(e);
    }
  }

  // -----------------------------

  public async addSong(queueItems: QueueItem[]) {
    this.queue = this.queue.concat(queueItems);
    if (!this.playing) {
      await this.play();
    }
    if (this.audioPlayer.state.status === AudioPlayerStatus.Paused) {
      this.audioPlayer.unpause();
    }
  }

  public stop(): void {
    this.playing = undefined;
    this.queue = [];
    this.audioPlayer.stop();
  }

  public leave(): void {
    if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) {
      this.voiceConnection.destroy();
    }
    this.stop();
    players.delete(this.guildId);
  }

  public skip(): void {
    this.play();
  }

  public async skipByTitle(title: string) {
    this.playing = this.queue.filter((e) => e.song.title.includes(title))[0];

    if (this.playing === undefined) {
      return null;
    }

    await this.startAudio(this.playing.song.url);
    return this.playing;
  }

  public pause(): void {
    this.audioPlayer.pause();
  }

  public resume() {
    this.audioPlayer.unpause();
  }

  public async play(): Promise<void> {
    if (this._isReplay) {
      await this.startAudio(this.playing?.song.url as string);
      return; // avoid checking 2 options below
    }

    if (this.queue.length > 0) {
      this.playing = this.queue.shift() as QueueItem;
      await this.startAudio(this.playing?.song.url as string);
      return; // because this.queue.shift() so the queue is empty, this will cause this.queue.length === 0
    }

    if (this.queue.length === 0) {
      this.playing = undefined;
      this.audioPlayer.stop();
      return;
    }
  }

  // ===============================================

  private async startAudio(songUrl: string): Promise<void> {
    try {
      const source = await play.stream(songUrl);
      this.audioPlayer.play(
        createAudioResource(source.stream, {
          inputType: source.type,
        }),
      );
    } catch (e: any) {
      // If there is any problem with player, then play the next song in queue
      logger.error('Error: player.model.ts', e);
      await this.play();
    }
  }

  public toJSON() {
    return {
      guildId: this.guildId,
      playing: this.playing,
      queue: this.queue,
      isReplay: this._isReplay,
    };
  }
}
