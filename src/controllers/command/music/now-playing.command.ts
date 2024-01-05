import {SlashCommandBuilder} from "@discordjs/builders";
import {AudioPlayerStatus} from "@discordjs/voice";
import {NotificationService} from "../../../services/noti/notification";
import {Client} from "discord.js";
import {players} from "../../../models/abstract-player.model";
import {Messages, MusicCommands} from "../../../constants/index.constant";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommands.nowPlaying.name)
        .setDescription(MusicCommands.nowPlaying.description)
        .setDMPermission(false),
    async execute(interaction: any, client: Client) {
        let player = players.get(interaction.guildId as string);
        if (!player) {
            await interaction.followUp(Messages.joinVoiceChannel);
            return;
        }
        if (!player.playing) {
            await interaction.followUp(Messages.notPlaying);
            return;
        }
        if (player.audioPlayer.state.status === AudioPlayerStatus.Playing) {
            await NotificationService.nowPlaying(player, interaction);
            return;
        }
        await interaction.followUp(Messages.notPlaying);
    }
}
