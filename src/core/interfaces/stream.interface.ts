import {AudioResource} from "@discordjs/voice/dist";

export interface IStream {
    getStream(url: string): Promise<any>;
    getAudioResource(url: string): Promise<AudioResource>;
}