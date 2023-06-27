import { SlashCommandBuilder } from "@discordjs/builders";
import {Player, players} from "../../../models/player";
import messages from "../../../../constants/messages";
import {MusicCommands} from "../../../../constants/musicCommands";
import {Client} from "discord.js";
import {InteractionNotification} from "../../../../services/noti/InteractionNotification";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommands.listQueue.name)
        .setDescription(MusicCommands.listQueue.description)
        .setDMPermission(false),
    async execute(interaction: any, client: Client) {
        const player = players.get(interaction.guildId as string) as Player;
        if (!player) {
            await interaction.followUp(messages.joinVoiceChannel);
            return;
        }
        if (player.queue.length === 0) {
            await interaction.followUp(messages.emptyQueue);
            return;
        }
        await InteractionNotification.getInstance().showQueue(interaction, player);
        return;
    }
}
