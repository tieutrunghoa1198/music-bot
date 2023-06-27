import {Player, QueueItem} from "../../mvc/models/player";
import {formatSeconds} from "../../utils/formatTime";
import {AudioPlayerStatus} from "@discordjs/voice";
import messages from "../../constants/messages";
import {createPlayMessage} from "../../mvc/views/embedMessages/play.embed";
import {INotification} from "../interface/INotification";
import {paginationMsg} from "../../mvc/views/embedMessages/queue.embed";
import {PlayerQueue} from "../../constants/playerQueue";
import {generateButton} from "../../mvc/views/buttons/buttons";
import {createSelectedTracks, numberOfPageSelectMenu} from "../../mvc/views/selectMenu/selectMenu";

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
            await userInteraction.channel.send(messages.addedToQueue(payload));
            return;
        }

        await userInteraction.channel.send({ embeds: [await createPlayMessage(payload)]});
    }

    public async showQueue(userInteraction: any, player: Player) {
        const msg = await paginationMsg(player, 1);
        const maxPage = Math.ceil(player.queue.length/PlayerQueue.MAX_PER_PAGE);
        const row = generateButton(1, maxPage);
        await userInteraction.channel.send({
            embeds: [msg.embedMessage],
            components: [
                await createSelectedTracks(msg.tracks),
                await numberOfPageSelectMenu(player.queue.length/PlayerQueue.MAX_PER_PAGE, 1),
                row
            ]
        })
    }

    public async defaultError(userInteraction: any) {
        await userInteraction.channel.send('asd');
    }
}
