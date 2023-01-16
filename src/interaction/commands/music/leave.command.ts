import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../../object/player";
import messages from "../../../constants/messages";
import {MusicCommand} from "../../../constants/musicCommand";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommand.leave.name)
        .setDescription(MusicCommand.leave.description)
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
