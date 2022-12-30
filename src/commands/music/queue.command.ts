import { SlashCommandBuilder } from "@discordjs/builders";
import {Player, players} from "../../models/player";
import messages from "../../constants/messages";
import {Command} from "../../constants/command";
import {generateButton, paginationMsg} from "./embedMessages/queue.embed";

export default {
    data: new SlashCommandBuilder()
        .setName(Command.listQueue.name)
        .setDescription(Command.listQueue.description),
    async execute(interaction: any) {
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

        const msg = await paginationMsg(player, 1);
        const row = generateButton();
        await interaction.followUp({
            embeds: [msg],
            components: [row]
        })
        return;
    }
}
