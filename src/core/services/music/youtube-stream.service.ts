import {IStream} from '@/core/interfaces/stream.interface';
import ytdl from '@distube/ytdl-core';
import {AudioResource} from '@discordjs/voice/dist';
import {demuxProbe} from '@discordjs/voice';
import {createAudioResource} from '@discordjs/voice';
import {logger} from "@/core/utils/logger.util";

export class YoutubeStream implements IStream {
  async getAudioResource(url: string): Promise<AudioResource | null> {
    const streamResource = await this.getStream(url);

    if (!streamResource) return null;

    const { stream, type } = await demuxProbe(streamResource);

    return createAudioResource(stream, { inputType: type });
  }

  async getStream(url: string) {
    try {
      return ytdl(url, {
        filter: function (format) {
          return format.audioBitrate && format.audioBitrate > 128
              ? format.audioQuality === 'AUDIO_QUALITY_MEDIUM' &&
              format.audioCodec === 'opus' &&
              format.audioBitrate > 128
              : format.audioQuality === 'AUDIO_QUALITY_MEDIUM' &&
              format.audioCodec === 'opus';
        },
        liveBuffer: 2000,
        highWaterMark: 1 << 25,
      });
    } catch (err) {
      logger.error(err + ' | cannot get youtube stream');
    }

    return null;
  }
}
