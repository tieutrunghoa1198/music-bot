import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../models/player";
import messages from "../../constants/messages";
import {Command} from "../../constants/command";

export default {
    data: new SlashCommandBuilder()
        .setName(Command.leave.name)
        .setDescription(Command.leave.description),
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
