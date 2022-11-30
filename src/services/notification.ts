import {AudioPlayerStatus} from "@discordjs/voice";
import {createPlayMessage} from "../commands/messages/play.message";
import {Player, QueueItem} from "../models/player";
import {formatSeconds} from "../utils/formatTime";
import {Platform} from "../types/song";
import messages from "../constants/messages";

export class NotificationService {
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
            platform: Platform.SOUND_CLOUD,
            guildName,
            requester: queueItem.requester,
            icon,
        }


        const message = await interaction.fetchReply();

        if (!message) {
            await interaction.deferUpdate();
            return;
        }

        if (player?.audioPlayer.state.status === AudioPlayerStatus.Playing) {
            await interaction.followUp(messages.addedToQueue(payload));
            return;
        }

        await interaction.followUp({ embeds: [createPlayMessage(payload)]});
    }
}
