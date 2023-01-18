import { SlashCommandBuilder } from "@discordjs/builders";
import {Player, players} from "../../../object/player";
import messages from "../../../constants/messages";
import {ExpCommands} from "../../../constants/musicCommands";
import {MusicAreas} from "../../../mongodb/music-area.model";
import {Client} from "discord.js";
export default {
    data: new SlashCommandBuilder()
        .setName(ExpCommands.setMusicArea.name)
        .setDescription(ExpCommands.setMusicArea.description)
        .setDMPermission(false),
    async execute(interaction: any, client: Client) {
        const player = players.get(interaction.guildId as string) as Player;
        if (!player) {
            await interaction.followUp(messages.joinVoiceChannel);
            return;
        }

        const musicAreaChannel = await MusicAreas.findOne({guildId: interaction.guildId})
        if (musicAreaChannel == null || musicAreaChannel == undefined) {
            await MusicAreas.collection.insertOne({
                guildId: interaction.guildId,
                guildName: interaction.member?.guild.name,
                textChannelId: interaction.channelId,
            })
            await interaction.followUp(messages.settingUpPaP(interaction.channelId));
        }
        else {
            await MusicAreas.collection
                .updateOne({guildId: interaction.guildId}, { $set: {textChannelId: interaction.channelId}})
            await interaction.followUp(messages.settingUpPaP(interaction.channelId));
        }
        return;
    }
}
