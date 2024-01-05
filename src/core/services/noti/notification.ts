import {createPlayMessage} from "@/core/views/embedMessages/play.embed";
import {Player} from "@/core/models/player";
import {formatSeconds} from "@/core/utils/format-time.util";
import {QueueItem} from "@/core/models/abstract-player.model";

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
        await interaction.followUp({embeds: [createPlayMessage(payload)]});
    }
}
