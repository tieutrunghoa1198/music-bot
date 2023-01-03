import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../models/player";
import messages from "../../constants/messages";
import {Command} from "../../constants/command";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName(Command.leave.name)
        .setDescription(Command.leave.description),
    async execute(interaction: any, client: Client) {
        await interaction.deferReply();
        let player = players.get(interaction.guildId as string);
        if (!player) {
            await interaction.followUp(messages.playerNotCreated)
            return;
        } else {
            player.leave();
            await interaction.followUp(messages.leaved)
        }
    }
}
