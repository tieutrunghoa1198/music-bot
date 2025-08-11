import { AudioManager } from '../audio-manager.service';
import { createAudioPlayer } from '@discordjs/voice';

jest.mock('@discordjs/voice', () => ({
  createAudioPlayer: jest.fn(),
  AudioPlayerStatus: { Idle: 'idle' },
}));

jest.mock('@/core/utils/logger.util', () => ({
  logger: { warn: jest.fn(), error: jest.fn() },
}));

describe('AudioManager', () => {
  let mockPlayer: any;

  beforeEach(() => {
    mockPlayer = {
      play: jest.fn(),
      pause: jest.fn(),
      unpause: jest.fn(),
      stop: jest.fn(),
      on: jest.fn(),
    };
    (createAudioPlayer as jest.Mock).mockReturnValue(mockPlayer);
  });

  it('plays audio resources', () => {
    const manager = new AudioManager();
    const first = { playStream: { destroy: jest.fn() } } as any;
    const second = { playStream: { destroy: jest.fn() } } as any;

    manager.play(first);
    manager.play(second);

    expect(first.playStream.destroy).toHaveBeenCalled();
    expect(mockPlayer.play).toHaveBeenLastCalledWith(second);
  });

  it('pauses playback', () => {
    const manager = new AudioManager();
    manager.pause();
    expect(mockPlayer.pause).toHaveBeenCalled();
  });

  it('resumes playback', () => {
    const manager = new AudioManager();
    manager.resume();
    expect(mockPlayer.unpause).toHaveBeenCalled();
  });

  it('stops playback', () => {
    const manager = new AudioManager();
    manager.stop();
    expect(mockPlayer.stop).toHaveBeenCalled();
  });

  it('emits error when play fails', (done) => {
    mockPlayer.play.mockImplementation(() => {
      throw new Error('fail');
    });
    const manager = new AudioManager();

    manager.audioPlayerError.subscribe((value: boolean) => {
      expect(value).toBe(true);
      done();
    });

    const resource = { playStream: { destroy: jest.fn() } } as any;
    manager.play(resource);
  });
});
