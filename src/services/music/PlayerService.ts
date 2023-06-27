// @ts-nocheck
import {Player, players, QueueItem} from "../../mvc/models/player";
import {Client, GuildMember} from "discord.js";
import {entersState, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus} from "@discordjs/voice";
import {soundCloudTrackRegex, youtubeVideoRegex} from "../../constants/regex";
import {Song} from "../../types/song";
import {SoundCloudService} from "./soundcloud";
import play from "play-dl";
import {YoutubeService} from "./youtube";
import {SpotifyService} from "./spotify";
import {InputType} from "../../types/InputType";
import {NotificationFactory} from "../noti/NotificationFactory";
import {Link} from "../../constants/link";

export class PlayerService {

    public static async handleTrack(song: Song, player: Player, username: string): QueueItem {
        const queueItem: QueueItem =
            {
                song,
                requester: username as string
            }
        await player?.addSong([queueItem]);
        return queueItem;
    }

    public static async handlePlaylist(tracks: Song[], player: Player, username: string): Promise<QueueItem[]>{
        const queueItems: QueueItem[] = [];
        await tracks.forEach(song => {
            queueItems.push({
                song,
                requester: username as string
            })
        });
        await player?.addSong(queueItems);
        return queueItems;
    }

    public static async createPlayer(interactObj: any, client: Client) {
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

    public static async classify(url: string) {
        let urlType;
        switch (true) {
            case url.match(youtubeVideoRegex)?.length > 0:
                if (url.includes('&list=RD')) urlType = Link.YoutubeRandomList;
                else urlType = Link.YoutubeTrack;
                break;
            case url.match(soundCloudTrackRegex)?.length > 0:
                if (SoundCloudService.isPlaylist(url)) urlType = Link.SoundCloudPlaylist
                else urlType = Link.SoundCloudTrack;
                break;
            case url.startsWith('https://open.spotify.com/'):
                let track = await play.spotify(url);
                switch (track.type) {
                    case "playlist":
                        urlType = Link.SpotifyPlaylist;
                        break;
                    case "album":
                        urlType = Link.SpotifyAlbum;
                        break;
                    case "track":
                        urlType = Link.SpotifyTrack;
                }
                break;
            default:
                urlType = Link.Empty;
        }
        return urlType;
    }

    public static async enterReadyState(player: Player) {
        await entersState(
            <VoiceConnection>player?.voiceConnection,
            VoiceConnectionStatus.Ready,
            10e3,
        );
    }

    public static async process(
        inputLink: String,
        linkType: Link,
        userInputType: InputType,
        player: Player,
        requester: String,
        userInteraction: any)
    {
        switch (linkType) {
            case Link.YoutubeTrack:
                await YoutubeService.getVideoDetail(inputLink)
                    .then(async (track: Song) => {
                        const queueItem: QueueItem = await PlayerService.handleTrack(track, player, requester);
                        NotificationFactory
                            .Notifier(userInputType)
                            .showNowPlaying(player, userInteraction, queueItem)
                    });
                break;
            case Link.YoutubeRandomList:
                await YoutubeService.getRandomList(inputLink)
                    .then(async data => {
                        await PlayerService.handlePlaylist(data.songs, player, requester)
                            .then(async () => {
                                NotificationFactory
                                    .Notifier(userInputType)
                                    .showQueue(userInteraction, player)
                            });
                    })
                break;
            case Link.SoundCloudTrack:
                await SoundCloudService.getTrackDetail(inputLink)
                    .then(async (track: Song) => {
                        const queueItem: QueueItem = await PlayerService.handleTrack(track, player, requester);
                        NotificationFactory
                            .Notifier(userInputType)
                            .showNowPlaying(player, userInteraction, queueItem)
                    })
                break;
            case Link.SoundCloudPlaylist:
                await SoundCloudService.getPlaylist(inputLink)
                    .then(async data => {
                        await PlayerService.handlePlaylist(data.songs, player, requester)
                            .then(async () => {
                                NotificationFactory
                                    .Notifier(userInputType)
                                    .showQueue(userInteraction, player)
                            });
                    })
                break;
            case Link.SpotifyPlaylist:
                await SpotifyService.getUrlInfo(inputLink)
                    .then(async songs => {
                        songs = songs as Song[]
                        await PlayerService.handlePlaylist(songs, player, requester)
                            .then(async () => {
                                NotificationFactory
                                    .Notifier(userInputType)
                                    .showQueue(userInteraction, player)
                            });
                    });
                break;
            case Link.Empty:
                NotificationFactory
                    .Notifier(userInputType)
                    .defaultError(userInteraction)
                break;
        }
    }

}

