import {Song} from "../types/song";
import {AudioPlayer, createAudioPlayer, VoiceConnection} from "@discordjs/voice";
import exp from "constants";
import {Snowflake} from "discord-api-types/globals";

export interface QueueItem {
    song: Song;
    requester: string;
}

export class Player {
    public guildId: string;
    public playing?: QueueItem;
    public queue: QueueItem[];
    public readonly voiceConnection: VoiceConnection;
    public readonly audioPlayer: AudioPlayer;
    private isReady = false;

    constructor(voiceConnection: VoiceConnection, guildId: string) {
        this.voiceConnection = voiceConnection;
        this.guildId = guildId;
        this.queue = [];
        this.playing = undefined;
        this.audioPlayer = createAudioPlayer();
    }
}

// Map các server mà bot đang trong kênh thoại
export const players = new Map<Snowflake, Player>();
