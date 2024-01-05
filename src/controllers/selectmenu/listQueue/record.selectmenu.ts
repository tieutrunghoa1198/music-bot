import {Player} from "../../../models/player";
import * as Constant from '../../../constants/index.constant'
import {Client} from "discord.js";
import {paginationMsg} from "../../../views/embedMessages/queue.embed";
import {players} from "../../../models/abstract-player.model";
import {AudioPlayerComponent} from "../../../views/group/audioPlayer.component";

export default {
    customId: Constant.BuilderID.pageSelectMenu,
    execute: async (interaction: any, client: Client) => {
        if (interaction.customId !== Constant.BuilderID.pageSelectMenu) {
            return;
        }

        const player = players.get(interaction.guildId) as Player;
        if (!player) {
            await interaction.followUp(Constant.Messages.joinVoiceChannel);
            return;
        }

        try {
            if (player.queue.length > 0) {
                const result = await interaction.values[0];
                const msg = await paginationMsg(player, parseInt(result));
                const audioComponent = await AudioPlayerComponent(msg, player, parseInt(result));
                const message = await interaction.channel.messages.fetch(interaction.message.id)
                player.replaceMessage().then();
                message.delete().catch((error: any) => {
                    // Only log the error if it is not an Unknown Message error
                    if (error) {
                        console.error('Failed to delete the message:', error);
                        return;
                    }
                });
                const response = await interaction.followUp({
                    embeds: [msg?.embedMessage],
                    components: audioComponent.components
                });
                player.message = response.id
                player.textChannel = response.channelId
            } else {
                interaction.followUp(Constant.Messages.emptyQueue);
            }
        } catch (e) {
            console.log(e)
            interaction.followUp(Constant.Messages.error);
        }
    }
}


