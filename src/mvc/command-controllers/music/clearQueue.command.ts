import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../models/player";
import messages from "../../../constants/messages";
import {MusicCommands} from "../../../constants/musicCommands";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommands.clear.name)
        .setDescription(MusicCommands.clear.description)
        .setDMPermission(false),
    async execute(interaction: any, client: Client) {
        let player = players.get(interaction.guildId as string);
        if (!player?.voiceConnection) {
            await interaction.followUp(messages.playerNotCreated)
        } else {
            player.queue = [];
            await interaction.followUp(messages.emptyQueue);
        }
    }
}
