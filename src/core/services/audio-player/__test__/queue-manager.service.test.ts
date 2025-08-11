import { QueueManager } from '../queue-manager.service';
import { Platform } from '../../../types/song.type';
import { QueueItem } from '../../../interfaces/player.interface';
import { AudioPlayerStatus } from '@discordjs/voice';

const classifyUrlMock = jest.fn().mockReturnValue('youtube');
jest.mock('../../../utils/common.util', () => ({
  classifyUrl: classifyUrlMock,
}));

const stream = { getStream: jest.fn(), getAudioResource: jest.fn() };
const StreamClassifierMock = jest
  .fn()
  .mockImplementation(() => ({ stream }));
jest.mock('../../../utils/stream-classifier.util', () => ({
  StreamClassifier: StreamClassifierMock,
}));

const createFFmpegStreamMock = jest.fn();
jest.mock('../../../utils/prism-media.util', () => ({
  createFFmpegStream: createFFmpegStreamMock,
}));

jest.mock('@discordjs/voice', () => ({
  AudioPlayerStatus: { Paused: 'paused' },
  createAudioResource: jest.fn(() => 'seekResource'),
}));

describe('QueueManager', () => {
  const audioManagerMock = {
    player: { state: { status: '' } },
    play: jest.fn(),
    resume: jest.fn(),
    stop: jest.fn(),
    audioPlayerError: { subscribe: jest.fn() },
  } as any;
  let manager: QueueManager;

  beforeEach(() => {
    jest.clearAllMocks();
    manager = new QueueManager('guild', audioManagerMock);
  });

  it('plays song from queue', async () => {
    const item: QueueItem = {
      song: {
        title: 't',
        length: 100,
        author: '',
        thumbnail: '',
        url: 'url',
        platform: Platform.YOUTUBE,
      },
      requester: 'r',
    };

    (manager as any)._queue = [item];
    jest
      .spyOn(manager, 'getAudioResource')
      .mockResolvedValue('resource' as any);

    await manager.play();

    expect(audioManagerMock.play).toHaveBeenCalledWith('resource');
    expect(manager.currentSong).toEqual(item);
  });

  it('skips to next song', () => {
    const playSpy = jest
      .spyOn(manager, 'play')
      .mockResolvedValue(undefined);
    manager.skip();
    expect(playSpy).toHaveBeenCalled();
  });

  it('seeks current song', async () => {
    (manager as any)._currentSong = {
      song: {
        url: 'url',
        length: 120,
        platform: Platform.YOUTUBE,
      },
      requester: 'r',
    };

    stream.getStream.mockResolvedValue('audio');
    createFFmpegStreamMock.mockReturnValue('ffmpeg');

    await manager.seek(10);

    expect(stream.getStream).toHaveBeenCalledWith('url');
    expect(createFFmpegStreamMock).toHaveBeenCalledWith('audio', 10);
    expect(audioManagerMock.play).toHaveBeenCalledWith('seekResource');
  });

  it('adds songs and resumes when paused', () => {
    audioManagerMock.player.state.status = AudioPlayerStatus.Paused;
    const songs: QueueItem[] = [
      {
        song: {
          title: 't',
          length: 100,
          author: '',
          thumbnail: '',
          url: 'url',
          platform: Platform.YOUTUBE,
        },
        requester: 'r',
      },
    ];

    const playSpy = jest
      .spyOn(manager, 'play')
      .mockImplementation(async () => undefined);

    manager.addSongs(songs);

    expect(manager.queue).toHaveLength(1);
    expect(playSpy).toHaveBeenCalled();
    expect(audioManagerMock.resume).toHaveBeenCalled();
  });
});
