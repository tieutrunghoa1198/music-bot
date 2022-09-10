import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../models/player";
import messages from "../../constants/messages";

export default {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('checking player status'),
    async execute(interaction: any) {
        await interaction.deferReply();
        console.log(interaction);
    }
}
