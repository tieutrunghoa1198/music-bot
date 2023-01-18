import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../../object/player";
import messages from "../../../constants/messages";
import {ExpCommands} from "../../../constants/musicCommands";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName(ExpCommands.restrict.name)
        .setDescription(ExpCommands.restrict.description)
        .setDMPermission(false),
    async execute(interaction: any, client: Client) {
        let player = players.get(interaction.guildId as string);
        if (!player) {
            await interaction.followUp(messages.playerNotCreated)
        } else {
            player.queue = [];
            await interaction.followUp(messages.emptyQueue);
        }
    }
}
