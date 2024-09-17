import { IStream } from '@/core/interfaces/stream.interface';
import play from 'play-dl';
import { createAudioResource } from '@discordjs/voice';

export class SoundcloudStream implements IStream {
  async getAudioResource(url: string) {
    const streamResource = await this.getStream(url);

    return createAudioResource(streamResource);
  }

  async getStream(url: string) {
    const stream = await play.stream(url);

    return stream.stream;
  }
}
