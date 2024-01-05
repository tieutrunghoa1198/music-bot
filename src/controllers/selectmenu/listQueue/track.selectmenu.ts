import {Player} from "../../../models/player";
import * as Constant from '../../../constants/index.constant'
import {Client} from "discord.js";
import {InteractionNotification} from "../../../services/noti/InteractionNotification";
import {players, QueueItem} from "../../../models/abstract-player.model";

export default {
    customId: Constant.BuilderID.trackSelectMenu,
    execute: async (interaction: any, client: Client) => {
        const player = players.get(interaction.guildId) as Player;
        if (!player) {
            await interaction.followUp(Constant.Messages.joinVoiceChannel);
            return;
        }

        if (player.queue.length > 0) {
            if (player?.isReplay === true) player.isReplay = false;
            const result = await interaction.values[0].split(Constant.GlobalConstants.specialSeparator)
            if (result?.length > 1) {
                const nowPlaying = await player.skipByTitle(result[0]) as QueueItem;
                if (nowPlaying === null) {
                    await interaction.followUp(Constant.Messages.cantFindAnyThing);
                    return;
                }
                await InteractionNotification
                    .getInstance()
                    .showNowPlaying(player, interaction, nowPlaying)
                return;
            }
            const nowPlaying = await player.skipByTitle(interaction.values[0]) as QueueItem;
            if (nowPlaying === null) {
                await interaction.followUp(Constant.Messages.cantFindAnyThing);
                return;
            }
            await InteractionNotification
                .getInstance()
                .showNowPlaying(player, interaction, nowPlaying)
        } else {
            await interaction.followUp(Constant.Messages.emptyQueue);
        }
    }
}

