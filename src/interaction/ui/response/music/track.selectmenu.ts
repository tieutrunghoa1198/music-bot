import {Player, players, QueueItem} from "../../../../object/player";
import {NotificationService} from "../../../../services/notification";
import messages from "../../../../constants/messages";
import {GlobalConstants} from "../../../../constants/common";
import {Client} from "discord.js";
import {BuilderID} from "../../../../constants/musicCommands";

async function interaction(interaction: any, client: Client) {
    if (interaction.customId !== BuilderID.trackSelectMenu) {
        return;
    }
    const player = players.get(interaction.guildId) as Player;
    if (!player) {
        await interaction.followUp(messages.joinVoiceChannel);
        return;
    }

    if (player.queue.length > 0) {
        if (player?.isReplay === true) player.isReplay = false;
        const result = await interaction.values[0].split(GlobalConstants.specialSeparator)
        if (result?.length > 1) {
            const nowPlaying = await player.skipByTitle(result[0]) as QueueItem;
            if (nowPlaying === null) {
                await interaction.followUp(messages.cantFindAnyThing);
                return;
            }
            await NotificationService.showNowPlaying(player, interaction, nowPlaying);
            return;
        }
        const nowPlaying = await player.skipByTitle(interaction.values[0]) as QueueItem;
        if (nowPlaying === null) {
            await interaction.followUp(messages.cantFindAnyThing);
            return;
        }
        await NotificationService.showNowPlaying(player, interaction, nowPlaying);
    } else {
        await interaction.followUp(messages.emptyQueue);
    }
}
export const TrackSelectMenu = {
    interaction,
}


