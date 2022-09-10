import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../models/player";
import messages from "../../constants/messages";

export default {
    data: new SlashCommandBuilder()
        .setName('hskip')
        .setDescription('List all songs in current queue.'),
    async execute(interaction: any) {
        await interaction.deferReply();
        let player = players.get(interaction.guildId as string);
        // if (!player) {
        //     await interaction.followUp(messages.error)
        //     return;
        // } else {
        //     await interaction.followUp('Song in queue: ' + player.queue.toString());
        //     console.log(player.queue);
        //     return;
        // }
    }
}
