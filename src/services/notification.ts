import {AudioPlayerStatus} from "@discordjs/voice";
import {createPlayMessage} from "../commands/music/embedMessages/play.embed";
import {Player, QueueItem} from "../models/player";
import {formatSeconds} from "../utils/formatTime";
import messages from "../constants/messages";
import {Message} from "discord.js";
import {generateButton, paginationMsg} from "../commands/music/embedMessages/queue.embed";
import {createSelectedTracks} from "../builders/selectMenu";

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
        const row = generateButton();
        await interaction.followUp({
            embeds: [msg],
            components: [await createSelectedTracks(player.queue), row]
        })
    }

    public static async messageShowQueue(message: any, player: Player) {
        const msg = await paginationMsg(player, 1);
        const row = generateButton();
        await message.channel.send({
            embeds: [msg],
            components: [await createSelectedTracks(player.queue), row]
        })
    }
}
