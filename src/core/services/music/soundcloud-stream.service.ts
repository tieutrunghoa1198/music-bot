import { IStream } from '@/core/interfaces/stream.interface';
import play from 'play-dl';
import { createAudioResource } from '@discordjs/voice';
import PuppeteerIntercept from "@/core/services/others/puppeteer-intercept";

export class SoundcloudStream implements IStream {

  async getAudioResource(url: string) {
    let streamResource;

    try {
      streamResource = await this.getStream(url);
    } catch (error) {
      await PuppeteerIntercept.setSoundCloudToken();
      streamResource = await this.getStream(url);
    }

    return streamResource ? createAudioResource(streamResource) : null;
  }

  async getStream(url: string) {
    try {
      const stream = await play.stream(url);

      return stream.stream;
    } catch (e) {
      throw new Error("SC 401 Error");
    }
  }
}
