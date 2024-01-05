import {Client} from "discord.js";
import {players} from "../../../models/abstract-player.model";
import {BuilderID, Messages} from "../../../constants/index.constant";

export default {
    customId: BuilderID.repeatSong,
    execute: async (interaction: any, client: Client) => {
        let player = players.get(interaction.guildId as string);
        if (!player) {
            await interaction.followUp(Messages.joinVoiceChannel);
            return;
        }
        player.isReplay = !player.isReplay;
        await interaction.followUp(Messages.replay(player.isReplay ? 'Bật' : 'Tắt'));
    }
}
