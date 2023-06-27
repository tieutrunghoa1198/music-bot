import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../models/player";
import messages from "../../../constants/messages";
import {MusicCommands} from "../../../constants/musicCommands";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommands.skip.name)
        .setDescription(MusicCommands.skip.description)
        .setDMPermission(false),
    async execute(interaction: any, client: Client) {
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
                if (player?.isReplay === true ) player.isReplay = false;
                player?.skip();
                await interaction.followUp(messages.skippedSong({title: player.playing?.song.title, requester: player.playing?.requester}));
            }
        } catch (e) {
            console.log(e);
            await interaction.followUp('erro');
        }
    }
}
