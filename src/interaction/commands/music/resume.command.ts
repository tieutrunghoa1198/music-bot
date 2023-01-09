import {SlashCommandBuilder} from "@discordjs/builders";
import {players} from "../../../object/player";
import messages from "../../../constants/messages";
import {AudioPlayerStatus} from "@discordjs/voice";
import {MusicCommand} from "../../../constants/musicCommand";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommand.resume.name)
        .setDescription(MusicCommand.resume.description),
    async execute(interaction: any, client: Client) {
        let player = players.get(interaction.guildId as string);
        if (!player) {
            await interaction.followUp(messages.joinVoiceChannel);
            return;
        }
        if (player.audioPlayer.state.status === AudioPlayerStatus.Paused) {
            player.resume();
            await interaction.followUp(messages.resumed);
            return;
        }
        await interaction.followUp(messages.notPlaying);
    }
}
