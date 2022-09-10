import {Platform, Song} from "../types/song";
import {
    AudioPlayer,
    AudioPlayerState,
    AudioPlayerStatus,
    createAudioPlayer, createAudioResource,
    entersState,
    VoiceConnection,
    VoiceConnectionDisconnectReason,
    VoiceConnectionState,
    VoiceConnectionStatus
} from "@discordjs/voice";
import {Snowflake} from "discord-api-types/globals";
import {SoundCloudService} from "../services/soundcloud";

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

                } else if (this.voiceConnection.rejoinAttempts < 5) {
                    this.voiceConnection.rejoin();
                } else {
                    this.leave();
                }


            } else if (newState.status === VoiceConnectionStatus.Destroyed) {
                this.leave();
            } else if (
                !this.isReady &&
                (newState.status === VoiceConnectionStatus.Connecting ||
                newState.status === VoiceConnectionStatus.Signalling)
            ) {
                this.isReady = true;
                try {
                    await entersState(
                        this.voiceConnection,
                        VoiceConnectionStatus.Ready,
                        20_000
                    );
                } catch {
                    if (
                        this.voiceConnection.state.status !==
                        VoiceConnectionStatus.Destroyed
                    )
                        this.voiceConnection.destroy();
                } finally {
                    this.isReady = false;
                }
            }


        })

        this.audioPlayer.on('stateChange', async (oldState: AudioPlayerState, newState: AudioPlayerState) => {
            if (
                newState.status === AudioPlayerStatus.Idle &&
                oldState.status !== AudioPlayerStatus.Idle
            ) {
                await this.play();
            }
        })

        voiceConnection.subscribe(this.audioPlayer);
    }

    public async addSong(queueItems: QueueItem[]) {
        this.queue = this.queue.concat(queueItems);
        if (!this.playing) {
            await this.play();
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

    public async play(): Promise<void> {
        try {
            console.log(this.queue, 'queue');
            if (this.queue.length > 0) {
                this.playing = this.queue.shift() as QueueItem;
                let stream: any;
                const highWaterMark = 1024 * 1024 * 10;
                console.log(this.playing);
                stream = await SoundCloudService.download(this.playing.song.url, highWaterMark);

                const audioResource = createAudioResource(stream);
                this.audioPlayer.play(audioResource);
            } else {
                this.playing = undefined;
                this.audioPlayer.stop();
            }
        } catch (e) {
            // If there is any problem with player, then play the next song in queue
            console.log(e);
            await this.play();
        }
    }

}

// Map các server mà bot đang trong kênh thoại
export const players = new Map<Snowflake, Player>();
