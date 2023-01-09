import {Player, players, QueueItem} from "../../../object/player";
import {Client, Message} from "discord.js";
import {YoutubeService} from "../../../services/youtube";
import {Song} from "../../../types/song";
import {NotificationService} from "../../../services/notification";
import {MusicAreas} from '../../../mongodb/music-area.model'
import {Link, PlayFeature} from "../../../features/play";
import {SoundCloudService} from "../../../services/soundcloud";
import {SpotifyService} from "../../../services/spotify";
import messages from "../../../constants/messages";
import path from "node:path";
import fs from "node:fs";

const handleYoutubeLink = async (msg: Message, client: Client) => {
    await MusicAreas
        .findOne(
            {textChannelId: msg.channel.id},
            async (err: any, musicAreaChannel: any) => {
                if (msg === null || msg === undefined) {
                    //@ts-ignore
                    await msg.channel.send('Message Deleted');
                    return;
                }

                if (!msg.content.startsWith('http')) {
                    return;
                }

                if (musicAreaChannel === null || musicAreaChannel === undefined) {
                    console.log('not found music area in this guild')
                    return;
                }

                const processingMsg = await msg.channel.send(messages.processing);
                const voiceChannel = msg.member?.voice.channel;
                if (!voiceChannel) {
                    await msg.channel.send(messages.userJoinVoiceChannel(msg.author.toString()));
                    await processingMsg.delete().catch((err: any) => {
                        console.log(err);
                    });
                    return;
                }
                let player = players.get(msg.guildId as string) as Player;

                if (!player) {
                    player = await PlayFeature.createPlayer(msg, client);
                }
                const username = msg.member?.user.username || '';
                const linkType = await PlayFeature.classify(msg.content);

                try {
                    await PlayFeature.enterReadyState(player);
                }catch (e) {
                    await msg.channel.send(messages.joinVoiceChannel);
                    console.log('cannot enter ready state')
                    return;
                }

                try {
                    switch (linkType) {
                        case Link.YoutubeTrack:
                            await YoutubeService.getVideoDetail(msg.content)
                                .then(async (track: Song) => {
                                    const queueItem: QueueItem = await PlayFeature.handleTrack(track, player, username);
                                    await NotificationService.showNowPlayingMsg(player, msg, queueItem)
                                });
                            break;
                        case Link.YoutubeRandomList:
                            await YoutubeService.getRandomList(msg.content)
                                .then(async data => {
                                    await PlayFeature.handlePlaylist(data.songs, player, username).then(async (queueItems: QueueItem[]) => {
                                        await NotificationService.messageShowQueue(msg, player);
                                    });
                                })
                            break;
                        case Link.SoundCloudTrack:
                            await SoundCloudService.getTrackDetail(msg.content)
                                .then(async (track: Song) => {
                                    const queueItem: QueueItem = await PlayFeature.handleTrack(track, player, username);
                                    await NotificationService.showNowPlayingMsg(player, msg, queueItem)
                                })
                            break;
                        case Link.SoundCloudPlaylist:
                            await SoundCloudService.getPlaylist(msg.content)
                                .then(async data => {
                                    await PlayFeature.handlePlaylist(data.songs, player, username).then(async (queueItems: QueueItem[]) => {
                                        await NotificationService.messageShowQueue(msg, player);
                                    });
                                })
                            break;
                        case Link.SpotifyPlaylist:
                            await SpotifyService.getUrlInfo(msg.content)
                                .then(async songs => {
                                    songs = songs as Song[]
                                    await PlayFeature.handlePlaylist(songs, player, username).then(async (queueItems: QueueItem[]) => {
                                        await NotificationService.messageShowQueue(msg, player);
                                    });
                                });
                            break;
                    }
                } catch (e) {
                    console.log(err);
                    await msg.channel.send(messages.error);
                } finally {
                    if (processingMsg.deletable) {
                        await processingMsg.delete().catch((err: any) => {
                            console.log(err)
                        })
                    }
                }
    }).clone()

}

export default {
    handleYoutubeLink
}
