import {AudioPlayerStatus} from "@discordjs/voice";
import {createPlayMessage} from "../interaction/ui/builder/embedMessages/play.embed";
import {Player, QueueItem} from "../object/player";
import {formatSeconds} from "../utils/formatTime";
import messages from "../constants/messages";
import {Message} from "discord.js";
import {paginationMsg} from "../interaction/ui/builder/embedMessages/queue.embed";
import {createSelectedTracks, numberOfPageSelectMenu} from "../interaction/ui/builder/selectMenu/selectMenu";
import {generateButton} from "../interaction/ui/builder/buttons/buttons";
import {PlayerQueue} from "../constants/playerQueue";

export class NotificationService {
    public static async nowPlaying(player: Player, interaction: any) {
        if (interaction === undefined || null) {
            console.log('wrong here =========')
            return;
        }
        const queueItem: QueueItem = player.playing as QueueItem;
        const guildName = interaction.member.guild.name;
        const icon = interaction.member.guild.iconURL();
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
        await interaction.followUp({ embeds: [await createPlayMessage(payload)]});
    }
    public static async showNowPlaying(player: Player, interaction: any, queueItem: QueueItem) {
        if (interaction === undefined || null) {
            console.log('wrong here =========')
            return;
        }
        const guildName = interaction.member.guild.name;
        const icon = interaction.member.guild.iconURL();
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


        const message = await interaction.fetchReply();

        if (!message) {
            await interaction.deferUpdate();
            return;
        }

        if (player?.audioPlayer.state.status === AudioPlayerStatus.Playing && player.queue.length > 0) {
            await interaction.followUp(messages.addedToQueue(payload));
            return;
        }

        await interaction.followUp({ embeds: [await createPlayMessage(payload)]});
    }

    public static async showNowPlayingMsg(player: Player, msg: Message, queueItem: QueueItem) {
        const song = queueItem.song;
        const guildName = msg.member?.guild.name as string;
        const icon = msg.member?.guild.iconURL() as string;
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
            await msg.channel.send(messages.addedToQueue(payload));
            return;
        }

        await msg.channel.send({ embeds: [await createPlayMessage(payload)]});
    }

    public static async interactionShowQueue(interaction: any, player: Player) {
        const msg = await paginationMsg(player, 1);
        const maxPage = Math.ceil(player.queue.length/PlayerQueue.MAX_PER_PAGE);
        const row = generateButton(1, maxPage);
        await interaction.followUp({
            embeds: [msg.embedMessage],
            components: [
                await createSelectedTracks(msg.tracks),
                await numberOfPageSelectMenu(player.queue.length/PlayerQueue.MAX_PER_PAGE, 1),
                row
            ]
        })
    }

    public static async messageShowQueue(message: any, player: Player) {
        const msg = await paginationMsg(player, 1);
        const maxPage = Math.ceil(player.queue.length/PlayerQueue.MAX_PER_PAGE);
        const row = generateButton(1, maxPage);
        await message.channel.send({
            embeds: [msg.embedMessage],
            components: [
                await createSelectedTracks(msg.tracks),
                await numberOfPageSelectMenu(player.queue.length/PlayerQueue.MAX_PER_PAGE, 1),
                row
            ]
        })
    }
}

export const ephemeralResponse = async (interaction: any, message: string) => {
    await interaction.followUp({
        content: message,
        ephemeral: true
    });
}
