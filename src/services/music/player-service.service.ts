//@ts-nocheck
import {Player, QueueItem} from "@/models/player";
import {Client, GuildMember} from "discord.js";
import {entersState, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus} from "@discordjs/voice";
import * as Constant from "@/constants/index.constant";
import {SoundCloudService} from "./soundcloud.service";
import play from "play-dl";
import {InputType} from "@/types/InputType";
import {YoutubeService} from "./youtube.service";
import {Song} from "@/types/song";
import {NotificationFactory} from "../noti/NotificationFactory";
import {SpotifyService} from "./spotify.service";
import {players} from "@/models/abstract-player.model";

export class PlayerService {
    private readonly player: Player;
    private readonly interactionObj: any;
    private readonly userInputType: InputType;
    constructor(interactionObj: any, client: Client, userInputType: InputType) {
        this.interactionObj = interactionObj;
        this.userInputType = userInputType;
        this.player = PlayerService.createPlayer(this.interactionObj, client);
        // console.log(interactionObj)

    }

    public async startPlay(input: string) {
        const requester = this.getRequester();
        const linkType = await this.classify(input);
        await this.enterReadyState(this.player);
        await this.process(
            input,
            linkType,
            this.userInputType,
            this.player,
            requester,
            this.interactionObj)
    }

    private async handleTrack(song: Song, player: Player, username: string): QueueItem {
        const queueItem: QueueItem =
            {
                song,
                requester: username as string
            }
        await player?.addSong([queueItem]);
        return queueItem;
    }

    private async handlePlaylist(tracks: Song[], player: Player, username: string): Promise<QueueItem[]>{
        const queueItems: QueueItem[] = [];
        tracks.forEach(song => {
            queueItems.push({
                song,
                requester: username as string
            });
        });
        await player?.addSong(queueItems);
        return queueItems;
    }

    private async process(
        inputLink: String,
        linkType: Constant.Link,
        userInputType: InputType,
        player: Player,
        requester: String,
        userInteraction: any)
    {
        switch (linkType) {
            case Constant.Link.YoutubeTrack:
                await YoutubeService.getVideoDetail(inputLink)
                    .then(async (track: Song) => {
                        const queueItem: QueueItem = await this.handleTrack(track, player, requester);
                        NotificationFactory
                            .Notifier(userInputType)
                            .showNowPlaying(player, userInteraction, queueItem)
                    });
                break;
            case Constant.Link.YoutubeRandomList:
                await YoutubeService.getRandomList(inputLink)
                    .then(async data => {
                        await this.handlePlaylist(data.songs, player, requester)
                            .then(async () => {
                                NotificationFactory
                                    .Notifier(userInputType)
                                    .showQueue(userInteraction, player)
                            });
                    })
                break;
            case Constant.Link.SoundCloudTrack:
                await SoundCloudService.getTrackDetail(inputLink)
                    .then(async (track: Song) => {
                        const queueItem: QueueItem = await this.handleTrack(track, player, requester);
                        NotificationFactory
                            .Notifier(userInputType)
                            .showNowPlaying(player, userInteraction, queueItem)
                    })
                break;
            case Constant.Link.SoundCloudPlaylist:
                await SoundCloudService.getPlaylist(inputLink)
                    .then(async data => {
                        await this.handlePlaylist(data.songs, player, requester)
                            .then(async () => {
                                NotificationFactory
                                    .Notifier(userInputType)
                                    .showQueue(userInteraction, player)
                            });
                    })
                break;
            case Constant.Link.SpotifyPlaylist:
                await SpotifyService.getUrlInfo(inputLink)
                    .then(async songs => {
                        songs = songs as Song[]
                        await this.handlePlaylist(songs, player, requester)
                            .then(async () => {
                                NotificationFactory
                                    .Notifier(userInputType)
                                    .showQueue(userInteraction, player)
                            });
                    });
                break;
            case Constant.Link.Empty:
                NotificationFactory
                    .Notifier(userInputType)
                    .defaultError(userInteraction)
                break;
        }
    }

    private async enterReadyState(player: Player) {
        try {
            await entersState(
                <VoiceConnection>player?.voiceConnection,
                VoiceConnectionStatus.Ready,
                10e3,
            );
        } catch (e) {
            console.log(e)
        }
    }

    private async classify(url: string) {
        let urlType;
        switch (true) {
            case url.match(Constant.youtubeVideoRegex)?.length > 0:
                if (url.includes('&list=RD')) urlType = Constant.Link.YoutubeRandomList;
                else urlType = Constant.Link.YoutubeTrack;
                break;
            case url.match(Constant.soundCloudTrackRegex)?.length > 0:
                if (SoundCloudService.isPlaylist(url)) urlType = Constant.Link.SoundCloudPlaylist
                else urlType = Constant.Link.SoundCloudTrack;
                break;
            case url.startsWith('https://open.spotify.com/'):
                let track = await play.spotify(url);
                switch (track.type) {
                    case "playlist":
                        urlType = Constant.Link.SpotifyPlaylist;
                        break;
                    case "album":
                        urlType = Constant.Link.SpotifyAlbum;
                        break;
                    case "track":
                        urlType = Constant.Link.SpotifyTrack;
                }
                break;
            default:
                urlType = Constant.Link.Empty;
        }
        return urlType;
    }

    public static createPlayer(interactObj: any, client: Client, isInteraction?: any) {
        let player = players.get(interactObj.guildId as string) as Player;
        if (!player) {
            if (
                interactObj.member instanceof GuildMember &&
                interactObj.member.voice.channel
            ) {
                const channel = interactObj.member.voice.channel;
                player = new Player(
                    joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator,
                    }),
                    interactObj.guildId as string,
                    client
                );
                players.set(interactObj.guildId as string, player);
                return player;
            }
        }
        return player;
    }

    private getRequester(): string {
        return this.interactionObj.member?.user.username || '';
    }
}
