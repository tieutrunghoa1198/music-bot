import {SlashCommandBuilder} from "@discordjs/builders";
import {AudioPlayerStatus} from "@discordjs/voice";
import {Client} from "discord.js";
import {players} from "../../../models/abstract-player.model";
import {Messages, MusicCommands} from "../../../constants/index.constant";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommands.resume.name)
        .setDescription(MusicCommands.resume.description)
        .setDMPermission(false),
    async execute(interaction: any, client: Client) {
        let player = players.get(interaction.guildId as string);
        if (!player) {
            await interaction.followUp(Messages.joinVoiceChannel);
            return;
        }
        if (player.audioPlayer.state.status === AudioPlayerStatus.Paused) {
            player.resume();
            await interaction.followUp(Messages.resumed);
            return;
        }
        await interaction.followUp(Messages.notPlaying);
    }
}
