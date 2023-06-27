import {SlashCommandBuilder} from "@discordjs/builders";
import {players} from "../../models/player";
import messages from "../../../constants/messages";
import {AudioPlayerStatus} from "@discordjs/voice";
import {MusicCommands} from "../../../constants/musicCommands";
import {NotificationService} from "../../../services/notification";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommands.nowPlaying.name)
        .setDescription(MusicCommands.nowPlaying.description)
        .setDMPermission(false),
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
