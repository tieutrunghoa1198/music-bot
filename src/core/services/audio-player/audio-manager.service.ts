import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
} from '@discordjs/voice';
import { IAudioManager } from '@/core/types/audio-manager.type';
import { AudioResource } from '@discordjs/voice/dist';
import { logger } from '@/core/utils/logger.util';
import { Subject } from 'rxjs';

export class AudioManager implements IAudioManager {
  private readonly _audioPlayer: AudioPlayer;
  private readonly _audioPlayerError: Subject<boolean> = new Subject<boolean>();
  private _currentResource: AudioResource | null = null;

  get audioPlayerError(): Subject<boolean> {
    return this._audioPlayerError;
  }

  get player() {
    return this._audioPlayer;
  }

  constructor() {
    this._audioPlayer = createAudioPlayer();
  }

  play(resource: AudioResource) {
    if (!resource) {
      logger.warn(
        'Tried to play a null or undefined AudioResource | play(resource: AudioResource)',
      );
      return;
    }

    try {
      this._currentResource?.playStream.destroy();
      this._currentResource = resource;
      this._audioPlayer.play(resource);
    } catch (error) {
      this._audioPlayerError.next(true);
      logger.error(
        `Failed to play resource | ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  pause() {
    this._audioPlayer.pause();
  }

  resume() {
    this._audioPlayer.unpause();
  }

  stop() {
    this._currentResource?.playStream.destroy();
    this._currentResource = null;
    this._audioPlayer.stop();
  }

  onIdle(callback: () => void) {
    this._audioPlayer.on('stateChange', (oldState, newState) => {
      const isIdle =
        newState.status === AudioPlayerStatus.Idle &&
        oldState.status !== AudioPlayerStatus.Idle;

      if (isIdle) callback();
    });
  }
}
