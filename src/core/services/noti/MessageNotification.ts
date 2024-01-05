import {Player} from "@/core/models/player";
import {formatSeconds} from "@/core/utils/format-time.util";
import {AudioPlayerStatus} from "@discordjs/voice";
import {createPlayMessage} from "@/core/views/embedMessages/play.embed";
import * as Constant from '@/core/constants/index.constant'
import {INotification} from "../../interfaces/notification.interface";
import {paginationMsg} from "@/core/views/embedMessages/queue.embed";
import {AudioPlayerComponent} from "@/core/views/group/audio-player.component";
import {QueueItem} from "@/core/models/abstract-player.model";
import {Song} from "@/core/types/song.type";

export class MessageNotification implements INotification {
    private static instance: MessageNotification

    public static getInstance(): MessageNotification {
        if (!MessageNotification.instance) {
            MessageNotification.instance = new MessageNotification();
        }
        return MessageNotification.instance;
    }

    public async showNowPlaying(player: Player, userInteraction: any, queueItem: QueueItem) {
        const song = queueItem.song;
        const guildName = userInteraction.member?.guild.name as string;
        const icon = userInteraction.member?.guild.iconURL() as string;
        const payload = {
            title: song.title,
            author: song.author,
            thumbnail: song.thumbnail,
            length: formatSeconds(song.length),
            platform: song.platform,
            guildName,
            requester: queueItem.requester,
            icon,
        }

        if (player?.audioPlayer.state.status === AudioPlayerStatus.Playing && player.queue.length > 0) {
            await userInteraction.channel.send(Constant.Messages.addedToQueue(payload));
            return;
        }

        await userInteraction.channel.send({ embeds: [createPlayMessage(payload)]});
    }

    public async showQueue(userInteraction: any, player: Player) {
        const msg = await paginationMsg(player, 1);
        const audioComponent = await AudioPlayerComponent(msg, player, 1);
        const song = player.playing?.song as Song;
        const guildName = userInteraction.member?.guild.name as string;
        const icon = userInteraction.member?.guild.iconURL() as string;
        const payload = this.getNowPlayingPayload(song, guildName, player.playing as QueueItem, icon);
        player.replaceMessage().then();
        const response = await userInteraction.channel.send({
            embeds: [createPlayMessage(payload)],
            components: audioComponent.components
        })
        player.message = response.id
        player.textChannel = response.channelId
    }

    public async defaultError(userInteraction: any) {
        await userInteraction.channel.send('asd');
    }

    private getNowPlayingPayload(song: Song, guildName: string, queueItem: QueueItem, icon: string) {
        return {
            title: song?.title || 'Unknown',
            author: song?.author || 'Unknown',
            thumbnail: song?.thumbnail || 'Unknown',
            length: formatSeconds(song?.length) || 'Unknown',
            platform: song?.platform || 'Unknown',
            guildName,
            requester: queueItem?.requester || 'Unknown',
            icon,
        }
    }
}
