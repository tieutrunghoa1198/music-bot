import { SlashCommandBuilder } from "@discordjs/builders";
import {Player, players} from "../../../object/player";
import messages from "../../../constants/messages";
import {Command} from "../../../constants/command";
import {NotificationService} from "../../../services/notification";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName(Command.listQueue.name)
        .setDescription(Command.listQueue.description),
    async execute(interaction: any, client: Client) {
        await interaction.deferReply();

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
