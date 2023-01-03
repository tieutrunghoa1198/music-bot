import {SlashCommandBuilder} from "@discordjs/builders";
import {players, QueueItem} from "../../models/player";
import messages from "../../constants/messages";
import {AudioPlayerStatus} from "@discordjs/voice";
import {Command} from "../../constants/command";
import {NotificationService} from "../../services/notification";

export default {
    data: new SlashCommandBuilder()
        .setName(Command.nowPlaying.name)
        .setDescription(Command.nowPlaying.description),
    async execute(interaction: any) {
        await interaction.deferReply();
        let player = players.get(interaction.guildId as string);
        if (!player) {
            await interaction.followUp(messages.joinVoiceChannel);
            return;
        }
        if (!player.playing) {
            await interaction.followUp(messages.notPlaying);
            return;
        }
        if (player.audioPlayer.state.status === AudioPlayerStatus.Playing) {
            await NotificationService.nowPlaying(player, interaction);
            return;
        }

        await interaction.followUp(messages.notPlaying);
    }
}
