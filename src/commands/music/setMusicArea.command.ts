import { SlashCommandBuilder } from "@discordjs/builders";
import {Player, players} from "../../models/player";
import messages from "../../constants/messages";
import {Command} from "../../constants/command";

export default {
    data: new SlashCommandBuilder()
        .setName(Command.setMusicArea.name)
        .setDescription(Command.setMusicArea.description),
    async execute(interaction: any) {
        await interaction.deferReply();

        const player = players.get(interaction.guildId as string) as Player;
        if (!player) {
            await interaction.followUp(messages.joinVoiceChannel);
            return;
        }

        player.musicArea = interaction.channelId;
        await interaction.followUp(messages.settingUpPaP(interaction.channelId));

        return;
    }
}
