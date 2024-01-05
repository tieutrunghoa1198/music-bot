import {INotification} from "../../interfaces/notification.interface";
import {Player} from "@/core/models/player";
import {formatSeconds} from "@/core/utils/format-time.util";
import {AudioPlayerStatus} from "@discordjs/voice";
import {createPlayMessage} from "@/core/views/embedMessages/play.embed";
import {paginationMsg} from "@/core/views/embedMessages/queue.embed";
import * as Constant from '@/core/constants/index.constant'
import {QueueItem} from "@/core/models/abstract-player.model";
import {AudioPlayerComponent} from "@/core/views/group/audio-player.component";
import {Song} from "@/core/types/song.type";

export class InteractionNotification implements INotification
{
    private static instance: InteractionNotification;

    public static getInstance(): InteractionNotification {
        if (!InteractionNotification.instance) {
            InteractionNotification.instance = new InteractionNotification();
        }

        return InteractionNotification.instance;
    }

    public async showNowPlaying(player: Player, userInteraction: any, queueItem: QueueItem) {
        if (userInteraction === undefined || null) {
            console.log('wrong here =========')
            return;
        }
        const guildName = userInteraction.member.guild.name;
        const icon = userInteraction.member.guild.iconURL();
        const song = queueItem.song;
        const payload = this.getNowPlayingPayload(song, guildName, queueItem, icon);
        const message = await userInteraction.fetchReply();

        if (!message) {
            await userInteraction.deferUpdate();
            return;
        }

        if (player?.audioPlayer.state.status === AudioPlayerStatus.Playing && player.queue.length > 0) {
            await userInteraction.followUp(Constant.Messages.addedToQueue(payload));
            return;
        }

        await userInteraction.followUp({ embeds: [await createPlayMessage(payload)]});
    }

    public async showQueue(userInteraction: any, player: Player) {
        const msg = await paginationMsg(player, 1);
        const audioComponent = await AudioPlayerComponent(msg, player, 1);
        const guildName = userInteraction.member.guild.name;
        const icon = userInteraction.member.guild.iconURL();
        const song = player.playing?.song as Song;
        const payload = this.getNowPlayingPayload(song, guildName, player.playing as QueueItem, icon);
        player.replaceMessage().then();
        const response = await userInteraction.followUp({
            embeds: [createPlayMessage(payload)],
            components: audioComponent.components
        })
        player.message = response.id
        player.textChannel = response.channelId
    }

    public async defaultError(userInteraction: any) {
        await userInteraction.followUp({ content: Constant.Messages.defaultError});
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
