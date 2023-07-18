import {BuilderID, Messages} from "../../../constants";
import {Client} from "discord.js";
import {players} from "../../../models/abstractPlayer";
import {AudioPlayerStatus} from "@discordjs/voice";

export default {
    customId: BuilderID.pauseResume,
    execute: async (interaction: any, client: Client) => {
        let player = players.get(interaction.guildId as string);
        if (!player) {
            await interaction.followUp(Messages.joinVoiceChannel);
            return;
        }
        if (player.audioPlayer.state.status === AudioPlayerStatus.Playing) {
            player.pause();
            await interaction.followUp(Messages.paused);
            return;
        }
        if (player.audioPlayer.state.status === AudioPlayerStatus.Paused) {
            player.resume();
            await interaction.followUp(Messages.resumed);
            return;
        }
        await interaction.followUp(Messages.notPlaying);
    }

}
