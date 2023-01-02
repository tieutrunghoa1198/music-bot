// @ts-nocheck
import {Player, players, QueueItem} from "../models/player";
import {GuildMember} from "discord.js";
import {entersState, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus} from "@discordjs/voice";
import {soundCloudTrackRegex, spotifyRegex, youtubeVideoRegex} from "../constants/regex";
import {Song} from "../types/song";
import {SoundCloudService} from "../services/soundcloud";

export class PlayFeature {

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
        console.log(queueItems[0])
        return queueItems;
    }

    public static async createPlayer(interactObj: any) {
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
                    interactObj.guildId as string
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
            case url.startsWith('https://open.spotify.com/'):
                urlType = Link.Spotify;
                break;
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

}

export enum Link {
    YoutubeTrack = 'yt_track',
    YoutubeRandomList = 'yt_random',
    SoundCloudTrack = 'sc_track',
    SoundCloudPlaylist = 'sc_playlist',
    Spotify = 'spotify'
}
