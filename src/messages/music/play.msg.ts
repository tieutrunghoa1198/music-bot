import {Player, players, QueueItem} from "../../models/player";
import {Message} from "discord.js";
import {YoutubeService} from "../../services/youtube";
import {Song} from "../../types/song";
import {NotificationService} from "../../services/notification";
import {MusicAreas} from '../../mongodb/music-area.model'
import {Link, PlayFeature} from "../../features/play";
import {SoundCloudService} from "../../services/soundcloud";
import {SpotifyService} from "../../services/spotify";
import messages from "../../constants/messages";

const handleYoutubeLink = async (msg: Message) => {
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
                    console.log('not found')
                    return;
                }

                let player = players.get(msg.guildId as string) as Player;

                if (!player) {
                    player = await PlayFeature.createPlayer(msg);
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
                                    await NotificationService.showNowPlayingMsg(player, msg, queueItems[0]);
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
                                    await NotificationService.showNowPlayingMsg(player, msg, queueItems[0]);
                                });
                            })
                        break;
                    case Link.Spotify:
                        await SpotifyService.getUrlInfo(msg.content)
                            .then(async songs => {
                                songs = songs as Song[]
                                await PlayFeature.handlePlaylist(songs, player, username).then(async (queueItems: QueueItem[]) => {
                                    await NotificationService.showNowPlayingMsg(player, msg, queueItems[0]);
                                });
                            });
                        break;
                }
    }).clone()

}

export default {
    handleYoutubeLink
}
