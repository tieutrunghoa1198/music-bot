import {SlashCommandBuilder} from "@discordjs/builders";
import {Client} from "discord.js";
import {players} from "@/models/abstract-player.model";
import {Messages, MusicCommands} from "@/constants/index.constant";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommands.leave.name)
        .setDescription(MusicCommands.leave.description)
        .setDMPermission(false),
    async execute(interaction: any, client: Client) {
        let player = players.get(interaction.guildId as string);
        if (!player) {
            await interaction.followUp(Messages.playerNotCreated)
            return;
        } else {
            player.leave();
            await interaction.followUp(Messages.leaved)
        }
    }
}
