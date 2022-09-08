import {Song} from "../types/song";
import {
    AudioPlayer,
    createAudioPlayer,
    entersState,
    VoiceConnection,
    VoiceConnectionDisconnectReason,
    VoiceConnectionState,
    VoiceConnectionStatus
} from "@discordjs/voice";
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

        this.voiceConnection.on('stateChange', async (_: VoiceConnectionState, newState: VoiceConnectionState) => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                /*
                  Nếu websocket đã bị đóng với mã 4014 có 2 khả năng:
                  - Nếu nó có khả năng tự kết nối lại (có khả năng do chuyển kênh thoại), cho 5s để reconnect.
                  - Nếu bot bị kick khỏi kênh thoại, ta sẽ phá huỷ kết nối.
				*/
                if (
                    newState.reason === VoiceConnectionDisconnectReason.WebSocketClose &&
                    newState.closeCode === 4014
                ) {
                    try {
                        await entersState(
                            this.voiceConnection,
                            VoiceConnectionStatus.Connecting,
                            5_000
                        );
                    } catch (e) {
                        this.leave();
                    }
                }


            }
        })
    }

    public async addSong(queueItems: QueueItem[]) {
        this.queue = this.queue.concat(queueItems);
        if (!this.playing) {
            // run play() here
        }
    }

    public stop(): void {
        this.playing = undefined;
        this.queue = [];
        this.audioPlayer.stop();
    }

    public leave(): void {
        if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) {
            this.voiceConnection.destroy();
        }
        this.stop();
        players.delete(this.guildId);
    }


}

// Map các server mà bot đang trong kênh thoại
export const players = new Map<Snowflake, Player>();
