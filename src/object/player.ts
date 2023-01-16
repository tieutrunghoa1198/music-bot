import {Song} from "../types/song";
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
import play from 'play-dl';
import {Client} from "discord.js";
export interface QueueItem {
    song: Song;
    requester: string;
}

export class Player {
    get isReplay(): boolean {
        return <boolean>this._isReplay;
    }

    set isReplay(value: boolean) {
        this._isReplay = value;
    }
    public guildId: string;
    public playing?: QueueItem;
    public queue: QueueItem[];
    public readonly voiceConnection: VoiceConnection;
    public readonly audioPlayer: AudioPlayer;
    private isReady = false;
    private client: Client;
    private _isReplay?: boolean;
    constructor(voiceConnection: VoiceConnection, guildId: string, client: Client) {
        this.voiceConnection = voiceConnection;
        this.guildId = guildId;
        this.queue = [];
        this.playing = undefined;
        this.audioPlayer = createAudioPlayer();
        this.client = client;
        this.voiceConnection.on('stateChange', async (_: VoiceConnectionState, newState: VoiceConnectionState) => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                /*
                  Nếu websocket đã bị đóng với mã 4014 có 2 khả năng:
                  - Nếu nó có khả năng tự kết nối lại (có khả năng do chuyển kênh thoại),
                    cho 5s để reconnect.
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
                client.emit('nextSong', {
                    nextSong: this.playing as QueueItem,
                    guildId: this.guildId
                })
            }
        })

        voiceConnection.subscribe(this.audioPlayer);
    }

    public async addSong(queueItems: QueueItem[]) {
        this.queue = this.queue.concat(queueItems);
        if (!this.playing) {
            await this.play();
        }
        if (this.audioPlayer.state.status === AudioPlayerStatus.Paused) {
            this.audioPlayer.unpause();
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

    public skip(): void {
        console.log(this.queue.length, ' Queue');
        this.play();
    }

    public async skipByTitle(title: string) {
        try {
            const selectedSong = this.queue.filter(e => e.song.title.includes(title));
            this.playing = selectedSong[0];
            const songUrl = this.playing?.song.url;
            const source = await play.stream(songUrl);
            const audioResource = createAudioResource(source.stream, {
                inputType: source.type
            });
            this.audioPlayer.play(audioResource);
            return this.playing;
        } catch (err) {
            console.log(err)
            return null;
        }
    }

    public pause(): void {
        this.audioPlayer.pause();
    }

    public resume() {
        this.audioPlayer.unpause();
    }

    public async jump(position: number): Promise<QueueItem> {
        const target = this.queue[position - 1];
        this.queue = this.queue
            .splice(0, position - 1)
            .concat(this.queue.splice(position, this.queue.length - 1));
        this.queue.unshift(target);
        await this.play();
        return target;
    }

    public async play(): Promise<void> {
        try {
            if (this?._isReplay === true) {
                const songUrl = this.playing?.song.url as string;
                await Player.hPlay(this.audioPlayer, songUrl);
                return;
            }
            if (this.queue.length > 0) {
                this.playing = this.queue.shift() as QueueItem;
                const songUrl = this.playing?.song.url;
                await Player.hPlay(this.audioPlayer, songUrl);
            } else {
                this.playing = undefined;
                this.audioPlayer.stop();
            }
        } catch (e) {
            // If there is any problem with player, then play the next song in queue
            console.log(e, 'Error: player.ts');
            await this.play();
        }
    }

    private static async hPlay(audioPlayer: AudioPlayer, songUrl: string): Promise<void> {
        const source = await play.stream(songUrl);
        const audioResource = createAudioResource(source.stream, {
            inputType: source.type
        });
        audioPlayer.play(audioResource);
    }
}

// Map các server mà bot đang trong kênh thoại
export const players = new Map<Snowflake, Player>();
