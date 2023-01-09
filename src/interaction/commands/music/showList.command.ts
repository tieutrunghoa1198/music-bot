import { SlashCommandBuilder } from "@discordjs/builders";
import {Player, players} from "../../../object/player";
import messages from "../../../constants/messages";
import {MusicCommand} from "../../../constants/musicCommand";
import {NotificationService} from "../../../services/notification";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommand.listQueue.name)
        .setDescription(MusicCommand.listQueue.description),
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
        await NotificationService.interactionShowQueue(interaction, player);
        return;
    }
}
