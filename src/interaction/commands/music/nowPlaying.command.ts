import {SlashCommandBuilder} from "@discordjs/builders";
import {players, QueueItem} from "../../../object/player";
import messages from "../../../constants/messages";
import {AudioPlayerStatus} from "@discordjs/voice";
import {MusicCommand} from "../../../constants/musicCommand";
import {NotificationService} from "../../../services/notification";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommand.nowPlaying.name)
        .setDescription(MusicCommand.nowPlaying.description),
    async execute(interaction: any, client: Client) {
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
