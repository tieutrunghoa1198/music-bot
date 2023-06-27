import {Player, players, QueueItem} from "../models/player";
import {NotificationService} from "../../services/noti/notification";
import messages from "../../constants/messages";
import {GlobalConstants} from "../../constants/common";
import {Client} from "discord.js";
import {BuilderID} from "../../constants/musicCommands";
import {InteractionNotification} from "../../services/noti/InteractionNotification";

async function interaction(interaction: any, client: Client) {

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
            await InteractionNotification
                .getInstance()
                .showNowPlaying(player, interaction, nowPlaying)
            return;
        }
        const nowPlaying = await player.skipByTitle(interaction.values[0]) as QueueItem;
        if (nowPlaying === null) {
            await interaction.followUp(messages.cantFindAnyThing);
            return;
        }
        await InteractionNotification
            .getInstance()
            .showNowPlaying(player, interaction, nowPlaying)
    } else {
        await interaction.followUp(messages.emptyQueue);
    }
}
export const TrackSelectMenu = {
    interaction,
}


