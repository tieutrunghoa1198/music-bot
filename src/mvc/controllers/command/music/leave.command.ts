import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../../models/player";
import messages from "../../../../constants/messages";
import {MusicCommands} from "../../../../constants/musicCommands";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommands.leave.name)
        .setDescription(MusicCommands.leave.description)
        .setDMPermission(false),
    async execute(interaction: any, client: Client) {
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
