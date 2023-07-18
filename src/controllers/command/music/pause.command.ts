import {SlashCommandBuilder} from "@discordjs/builders";
import {AudioPlayerStatus} from "@discordjs/voice";
import {Client} from "discord.js";
import {players} from "../../../models/abstractPlayer";
import {Messages, MusicCommands} from "../../../constants";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommands.pause.name)
        .setDescription(MusicCommands.pause.description)
        .setDMPermission(false),
    async execute(interaction: any, client: Client) {
        let player = players.get(interaction.guildId as string);
        if (!player?.voiceConnection) {
            await interaction.followUp(Messages.joinVoiceChannel);
            return;
        }
        if (player.audioPlayer.state.status === AudioPlayerStatus.Playing) {
            player.pause();
            await interaction.followUp(Messages.paused);
            return;
        }
        await interaction.followUp(Messages.notPlaying);
    }
}
