import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../models/player";
import messages from "../../constants/messages";
import {createQueueMessages} from "../messages/queueMessage";
import {TextChannel} from "discord.js";
import {pagination} from "reconlx";

export default {
    data: new SlashCommandBuilder()
        .setName('hqueue')
        .setDescription('List all songs in current queue.'),
    async execute(interaction: any) {
        await interaction.deferReply();
        const player = players.get(interaction.guildId as string);
        if (!player) {
            await interaction.followUp(messages.joinVoiceChannel);
            return;
        }
        if (player.queue.length === 0) {
            await interaction.followUp(messages.nothing);
            return;
        }

        const embedMessages = createQueueMessages(player.queue);
        await interaction.editReply(messages.yourQueue);

        if (
            interaction &&
            interaction.channel &&
            interaction.channel instanceof TextChannel
        ) {
            // interaction.editReply({ embeds: [embedMessages]});
            await pagination({
                embeds: embedMessages,
                channel: interaction.channel as TextChannel,
                author: interaction.user,
                fastSkip: true,
            });
        }
    }
}
