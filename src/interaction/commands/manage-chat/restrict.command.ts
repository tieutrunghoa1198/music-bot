import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../../object/player";
import messages from "../../../constants/messages";
import {Command} from "../../../constants/command";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName(Command.restrict.name)
        .setDescription(Command.restrict.description),
    async execute(interaction: any, client: Client) {
        await interaction.deferReply();
        let player = players.get(interaction.guildId as string);
        if (!player) {
            await interaction.followUp(messages.playerNotCreated)
        } else {
            player.queue = [];
            await interaction.followUp(messages.emptyQueue);
        }
    }
}