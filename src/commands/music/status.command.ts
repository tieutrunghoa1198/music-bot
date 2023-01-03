import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../models/player";
import messages from "../../constants/messages";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('checking player status'),
    async execute(interaction: any, client: Client) {
        await interaction.deferReply();
        let player = players.get(interaction.guildId as string);
        if (!player) {
            await interaction.followUp(messages.error)
            return;
        }

        console.log(player.voiceConnection.state)
    }
}
