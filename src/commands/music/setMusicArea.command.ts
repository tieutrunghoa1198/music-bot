import { SlashCommandBuilder } from "@discordjs/builders";
import {Player, players} from "../../models/player";
import messages from "../../constants/messages";
import {Command} from "../../constants/command";
import mongoose from "mongoose";
import {MusicAreas} from "../../mongodb/music-area.model";
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

        const musicAreaChannel = await MusicAreas.findOne({guildId: interaction.guildId})
        console.log(musicAreaChannel)
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
