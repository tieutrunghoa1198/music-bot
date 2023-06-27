import {SlashCommandBuilder} from "@discordjs/builders";
import {createSelectedTracks} from "../../views/selectMenu/selectMenu";
import {Player, players} from "../../models/player";
import messages from "../../../constants/messages";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('checking player status')
        .setDMPermission(false),
    async execute(interaction: any, client: Client) {
        const player = players.get(interaction.guildId) as Player;
        if (!player) {
            await interaction.followUp(messages.joinVoiceChannel);
            return;
        }
        if (player?.queue.length > 0) {
            await interaction.followUp({ components: [await createSelectedTracks(player.queue)]});
        } else {
            await interaction.followUp({ content: messages.emptyQueue})
        }
    }
}
