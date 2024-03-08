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
  private isReady: boolean = false;
  private client: Client;
  private _isReplay?: boolean;

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
        ) this.voiceConnection.configureNetworking();

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
            try {
              await entersState(
                this.voiceConnection,
                VoiceConnectionStatus.Connecting,
                5_000,
              );
            } catch (e) {
              this.leave();
            }
          }
          if (this.voiceConnection.rejoinAttempts < 5) this.voiceConnection.rejoin();
          if (this.voiceConnection.rejoinAttempts >= 5) this.leave();
        }

        if (newState.status === VoiceConnectionStatus.Destroyed) this.leave();

        if (
          !this.isReady &&
          (newState.status === VoiceConnectionStatus.Connecting ||
            newState.status === VoiceConnectionStatus.Signalling)
        ) {
          this.isReady = true;
          try {
            await entersState(
              this.voiceConnection,
              VoiceConnectionStatus.Ready,
              20_000,
            );
          } catch {
            if (
              this.voiceConnection.state.status !==
              VoiceConnectionStatus.Destroyed
            )
              this.voiceConnection.destroy();
          } finally {
            this.isReady = false;
          }
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
          await this.play();
          this.client.emit('nextSong', {
            nextSong: this.playing as QueueItem,
            guildId: this.guildId,
          });
        }
      },
    );
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
    try {
      this.playing = this.queue.filter((e) => e.song.title.includes(title))[0];
      const source = await play.stream(this.playing?.song.url);
      this.audioPlayer.play(
        createAudioResource(source.stream, {
          inputType: source.type,
        }),
      );
      return this.playing;
    } catch (err) {
      logger.error('player.skipByTitle at player.model.ts', err);
      return null;
    }
  }

  public pause(): void {
    this.audioPlayer.pause();
  }

  public resume() {
    this.audioPlayer.unpause();
  }

  public async play(): Promise<void> {
    try {
      if (this?._isReplay === true) {
        const songUrl = this.playing?.song.url as string;
        await this.startAudio(this.audioPlayer, songUrl);
        return;
      }
      if (this.queue.length > 0) {
        this.playing = this.queue.shift() as QueueItem;
        const songUrl = this.playing?.song.url as string;
        await this.startAudio(this.audioPlayer, songUrl);
      } else {
        this.playing = undefined;
        this.audioPlayer.stop();
      }
    } catch (e: any) {
      // If there is any problem with player, then play the next song in queue
      logger.error('Error: player.model.ts', e);
      await this.play();
    }
  }

  private async startAudio(
    audioPlayer: AudioPlayer,
    songUrl: string,
  ): Promise<void> {
    const source = await play.stream(songUrl);
    const audioResource = createAudioResource(source.stream, {
      inputType: source.type,
    });
    audioPlayer.play(audioResource);
  }
}
