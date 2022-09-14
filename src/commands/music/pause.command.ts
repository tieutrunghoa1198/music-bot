import {SlashCommandBuilder} from "@discordjs/builders";
import {players} from "../../models/player";
import messages from "../../constants/messages";
import {AudioPlayerStatus} from "@discordjs/voice";

export default {
    data: new SlashCommandBuilder()
        .setName('hpause')
        .setDescription('Pause the track'),
    async execute(interaction: any) {
        await interaction.deferReply();
        let player = players.get(interaction.guildId as string);
        if (!player) {
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
