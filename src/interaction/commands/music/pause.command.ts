import {SlashCommandBuilder} from "@discordjs/builders";
import {players} from "../../../object/player";
import messages from "../../../constants/messages";
import {AudioPlayerStatus} from "@discordjs/voice";
import {MusicCommands} from "../../../constants/musicCommands";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommands.pause.name)
        .setDescription(MusicCommands.pause.description)
        .setDMPermission(false),
    async execute(interaction: any, client: Client) {
        let player = players.get(interaction.guildId as string);
        if (!player?.voiceConnection) {
            await interaction.followUp(messages.joinVoiceChannel);
            return;
        }
        if (player.audioPlayer.state.status === AudioPlayerStatus.Playing) {
            player.pause();
            await interaction.followUp(messages.paused);
            return;
        }
        await interaction.followUp(messages.notPlaying);
    }
}
