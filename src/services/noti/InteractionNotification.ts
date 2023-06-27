import {INotification} from "../interface/INotification";
import {Player, QueueItem} from "../../mvc/models/player";
import {formatSeconds} from "../../utils/formatTime";
import {AudioPlayerStatus} from "@discordjs/voice";
import messages from "../../constants/messages";
import {createPlayMessage} from "../../mvc/views/embedMessages/play.embed";
import {paginationMsg} from "../../mvc/views/embedMessages/queue.embed";
import {PlayerQueue} from "../../constants/playerQueue";
import {generateButton} from "../../mvc/views/buttons/buttons";
import {createSelectedTracks, numberOfPageSelectMenu} from "../../mvc/views/selectMenu/selectMenu";

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


        const message = await userInteraction.fetchReply();

        if (!message) {
            await userInteraction.deferUpdate();
            return;
        }

        if (player?.audioPlayer.state.status === AudioPlayerStatus.Playing && player.queue.length > 0) {
            await userInteraction.followUp(messages.addedToQueue(payload));
            return;
        }

        await userInteraction.followUp({ embeds: [await createPlayMessage(payload)]});
    }

    public async showQueue(userInteraction: any, player: Player) {
        const msg = await paginationMsg(player, 1);
        const maxPage = Math.ceil(player.queue.length/PlayerQueue.MAX_PER_PAGE);
        const row = generateButton(1, maxPage);
        await userInteraction.followUp({
            embeds: [msg.embedMessage],
            components: [
                await createSelectedTracks(msg.tracks),
                await numberOfPageSelectMenu(player.queue.length/PlayerQueue.MAX_PER_PAGE, 1),
                row
            ]
        })
    }

    public async defaultError(userInteraction: any) {
        await userInteraction.followUp({ content: messages.defaultError});
    }

}
