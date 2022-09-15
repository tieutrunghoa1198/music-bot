import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../models/player";
import messages from "../../constants/messages";
import {Command} from "../../constants/command";

export default {
    data: new SlashCommandBuilder()
        .setName(Command.skip.name)
        .setDescription(Command.skip.description),
    async execute(interaction: any) {
        await interaction.deferReply();
        try {
            let player = players.get(interaction.guildId as string);
            if (player?.queue.length === 0) {
                await interaction.followUp('the queue is empty');
            } else {
                player?.skip();
            }
        } catch (e) {
            console.log(e);
            await interaction.followUp('erro')
        }
    }
}
