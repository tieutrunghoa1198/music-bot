import {SlashCommandBuilder} from "@discordjs/builders";
import {players} from "../../models/player";
import messages from "../../constants/messages";
import {AudioPlayerStatus} from "@discordjs/voice";
import {Command} from "../../constants/command";

export default {
    data: new SlashCommandBuilder()
        .setName(Command.resume.name)
        .setDescription(Command.resume.description),
    async execute(interaction: any) {
        await interaction.deferReply();
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
