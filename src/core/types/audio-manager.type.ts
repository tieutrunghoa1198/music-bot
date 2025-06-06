import {AudioResource} from "@discordjs/voice/dist";

export interface IAudioManager {
    play(resource: AudioResource): void
    pause(): void,
    resume(): void,
    stop(): void,
    onIdle(callback: () => void): void,
}