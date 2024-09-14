import {IStream} from "@/core/interfaces/stream.interface";
import ytdl from '@distube/ytdl-core';
import {AudioResource} from "@discordjs/voice/dist";
import {createAudioResource} from "@discordjs/voice";

export class YoutubeStream implements IStream {

    async getAudioResource(url: string): Promise<AudioResource> {
        const streamResource = await this.getStream(url);

        return createAudioResource(streamResource);
    }

    async getStream(url: string) {
        return ytdl(url, { filter: 'audioonly' });
    }

}