import {IStream} from "@/core/interfaces/stream.interface";
import play from "play-dl";
import {createAudioResource} from "@discordjs/voice";

export class SoundcloudStream implements IStream {

    async getAudioResource(url: string) {
        const streamResource = await this.getStream(url);

        return createAudioResource(streamResource.stream, {
            inputType: streamResource.type,
        });
    }

    async getStream(url: string) {
        return await play.stream(url);
    }

}