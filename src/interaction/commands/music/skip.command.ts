import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../../object/player";
import messages from "../../../constants/messages";
import {Command} from "../../../constants/command";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName(Command.skip.name)
        .setDescription(Command.skip.description),
    async execute(interaction: any, client: Client) {
        await interaction.deferReply();
        try {
            let player = players.get(interaction.guildId as string);

            if (!player) {
                await interaction.followUp(messages.playerNotFound);
                await interaction.followUp(messages.joinVoiceChannel);
                return;
            }

            if (player?.queue.length === 0) {
                await interaction.followUp('the queue is empty');
            } else {
                player?.skip();
                await interaction.followUp(messages.skippedSong({title: player.playing?.song.title, requester: player.playing?.requester}));
            }
        } catch (e) {
            console.log(e);
            await interaction.followUp('erro');
        }
    }
}
