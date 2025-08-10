import { VoiceConnection } from '@discordjs/voice';

export class VoiceConnectionManager {
  constructor(private connection: VoiceConnection) {}

  get voiceConnection() {
    return this.connection;
  }
}
