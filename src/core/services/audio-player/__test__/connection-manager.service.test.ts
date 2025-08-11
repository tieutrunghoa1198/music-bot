import { VoiceConnectionManager } from '../connection-manager.service';

describe('VoiceConnectionManager', () => {
  it('returns the provided voice connection', () => {
    const connection = {} as any;
    const manager = new VoiceConnectionManager(connection);
    expect(manager.voiceConnection).toBe(connection);
  });
});
