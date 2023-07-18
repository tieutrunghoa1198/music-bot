import {AudioPlayer, VoiceConnection} from "@discordjs/voice";
import {Song} from "../types/song";
import {Snowflake} from "discord-api-types/globals";
import {Player} from "./player";

export interface AbstractPlayer {
    guildId: string;
    playing?: QueueItem;
    queue: QueueItem[];
    message: any;
    textChannel: any;
    readonly voiceConnection: VoiceConnection;
    readonly audioPlayer: AudioPlayer;
    addSong(queueItems: QueueItem[]): void
    stop(): void
    leave(): void
    skip(): void
    skipByTitle(title: string): void
    pause(): void
    resume(): void
    play(): void
    jump(position: number): Promise<QueueItem>
}
export interface QueueItem {
    song: Song;
    requester: string;
}

// Map các server mà bot đang trong kênh thoại
export const players = new Map<Snowflake, Player>();
