import { AudioManager } from '@/core/services/audio-player/audio-manager.service';
import { QueueItem } from '../../interfaces/player.interface';
import { AudioResource } from '@discordjs/voice/dist';
import { classifyUrl } from '@/core/utils/common.util';
import { StreamClassifier } from '@/core/utils/stream-classifier.util';
import { AudioPlayerStatus, createAudioResource } from '@discordjs/voice';
import { Platform } from '@/core/types/song.type';
import { createFFmpegStream } from '@/core/utils/prism-media.util';

export class QueueManager {
  public guildId: string;
  private _queue: QueueItem[] = [];
  private _currentSong: QueueItem | undefined;
  private _isReplay: boolean = false;
  private audioManager: AudioManager;

  get queue(): QueueItem[] {
    return this._queue;
  }

  get currentSong(): QueueItem | undefined {
    return this._currentSong;
  }

  get isReplay(): boolean {
    return this._isReplay;
  }

  set isReplay(value: boolean) {
    this._isReplay = value;
  }

  constructor(guildId: string, audioManager: AudioManager) {
    this.guildId = guildId;
    this.audioManager = audioManager;
    this.listenAudioPlayerError();
  }

  async play() {
    if (this._isReplay) {
      const audioResource = await this.getAudioResource(
        this._currentSong?.song.url as string,
      );
      if (!audioResource) return;
      this.audioManager.play(audioResource);
      return;
    }

    if (this._queue.length > 0) {
      this._currentSong = this._queue.shift() as QueueItem;
      const audioResource = await this.getAudioResource(
        this._currentSong.song.url as string,
      );
      if (!audioResource) return;
      this.audioManager.play(audioResource);
      return;
    }

    if (this._queue.length === 0) {
      this._currentSong = undefined;
      this.audioManager.stop();
      return;
    }
  }

  skip(): void {
    this.play();
  }

  skipByTitle(title: string): QueueItem | null {
    this._currentSong = this.queue.filter((e) =>
      e.song.title.includes(title),
    )[0];

    if (this._currentSong === undefined) return null;

    return this._currentSong;
  }

  clearQueue(): void {
    this._queue = [];
  }

  stop(): void {
    this._currentSong = undefined;
    this._queue = [];
    this.audioManager.stop();
  }

  async seek(second: number | null) {
    const songLength = this._currentSong?.song.length ?? 0;

    if (!this._currentSong) return;
    if (!second) return;
    if (isNaN(Number(second))) return;
    if (songLength < second) return;
    if (
      // this._currentSong.song.platform === Platform.SOUND_CLOUD ||
      this._currentSong.song.platform === Platform.SPOTIFY
    )
      return;

    const songType = classifyUrl(this._currentSong.song.url);
    const sourceStream = new StreamClassifier(songType);
    const audioResource = await sourceStream.stream.getStream(
      this._currentSong.song.url,
    );
    const seekedStream = createFFmpegStream(audioResource, second);

    this.audioManager.play(createAudioResource(seekedStream));
  }

  addSongs(queueItems: QueueItem[]) {
    const isPause =
      this.audioManager.player.state.status === AudioPlayerStatus.Paused;

    this._queue = this._queue.concat(queueItems);

    if (!this._currentSong) this.play();
    if (isPause) this.audioManager.resume();
  }

  async getAudioResource(url: string): Promise<AudioResource | null> {
    const songType = classifyUrl(url);
    const sourceStream = new StreamClassifier(songType);

    return sourceStream.stream.getAudioResource(url);
  }

  listenAudioPlayerError() {
    this.audioManager.audioPlayerError.subscribe(() => {
      this.play();
    });
  }

  toJSON = () => ({
    guildId: this.guildId,
    playing: this._currentSong,
    isReplay: this._isReplay,
  });
}
