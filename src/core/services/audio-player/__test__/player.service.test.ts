/* eslint-env jest */
const audioManagerMock = { player: {}, onIdle: jest.fn() };
const queueManagerMock = { play: jest.fn(), stop: jest.fn(), currentSong: null };
const deleteMock = jest.fn();
const sendMock = jest.fn();
const getMock = jest.fn().mockReturnValue({ send: sendMock });
const musicAreaRepo = { findByGuildId: jest.fn() };
const voiceConnectionMock = {
  subscribe: jest.fn(),
  state: { status: 'ready' },
  destroy: jest.fn(),
};

jest.mock('@/core/services/audio-player/audio-manager.service', () => ({
  AudioManager: jest.fn().mockImplementation(() => audioManagerMock),
}));

jest.mock('@/core/services/audio-player/queue-manager.service', () => ({
  QueueManager: jest.fn().mockImplementation(() => queueManagerMock),
}));

jest.mock('@/core/constants/common.constant', () => ({
  players: { delete: deleteMock },
}));

jest.mock('@/bot-client', () => ({
  botClient: { channels: { cache: { get: getMock } } },
}));

jest.mock('@discordjs/voice', () => ({
  VoiceConnectionStatus: { Destroyed: 'destroyed', Ready: 'ready' },
}));

const Messages = {
  skippedSong: (payload: any) => `skip ${payload.title} - ${payload.requester}`,
};
jest.mock('@/core/constants/messages.constant', () => ({ Messages }));

import { Player } from '../player.service';
import { Messages as RealMessages } from '@/core/constants/messages.constant';

describe('Player service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends message on next song', async () => {
    musicAreaRepo.findByGuildId.mockResolvedValue({ textChannelId: '123' });
    const player = new Player(voiceConnectionMock as any, 'guild', musicAreaRepo as any);

    await player.onNextSong({
      nextSong: { song: { title: 'Title' }, requester: 'Req' },
      guildId: 'guild',
    });

    expect(musicAreaRepo.findByGuildId).toHaveBeenCalledWith('guild');
    expect(getMock).toHaveBeenCalledWith('123');
    expect(sendMock).toHaveBeenCalledWith(
      RealMessages.skippedSong({ title: 'Title', requester: 'Req' }),
    );
  });

  it('cleans up on leave', () => {
    const player = new Player(voiceConnectionMock as any, 'guild', musicAreaRepo as any);
    player.leave();
    expect(voiceConnectionMock.destroy).toHaveBeenCalled();
    expect(queueManagerMock.stop).toHaveBeenCalled();
    expect(deleteMock).toHaveBeenCalledWith('guild');
  });
});
