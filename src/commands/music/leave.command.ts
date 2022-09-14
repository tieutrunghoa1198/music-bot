import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../models/player";
import messages from "../../constants/messages";

export default {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Ngắt kết nối với kênh chat'),
    async execute(interaction: any) {
        await interaction.deferReply();
        let player = players.get(interaction.guildId as string);
        if (!player) {
            await interaction.followUp(messages.error)
            return;
        } else {
            player.leave();
            await interaction.followUp(messages.leaved)
        }
    }
}
