import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../../object/player";
import messages from "../../../constants/messages";
import {MusicCommand} from "../../../constants/musicCommand";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommand.clear.name)
        .setDescription(MusicCommand.clear.description),
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
