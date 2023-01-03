import {SlashCommandBuilder} from "@discordjs/builders";
import {players} from "../../models/player";
import messages from "../../constants/messages";
import {AudioPlayerStatus} from "@discordjs/voice";
import {Command} from "../../constants/command";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName(Command.pause.name)
        .setDescription(Command.pause.description),
    async execute(interaction: any, client: Client) {
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
