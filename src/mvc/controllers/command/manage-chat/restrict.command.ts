import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../../models/player";
import messages from "../../../../constants/messages";
import {ExpCommands} from "../../../../constants/musicCommands";
import {Client} from "discord.js";
import {ChannelType} from "discord-api-types/v9";
import {RestrictChannel} from "../../../../mongodb/restrict.model";
import {MusicAreas} from "../../../../mongodb/music-area.model";

export default {
    data: new SlashCommandBuilder()
        .setName(ExpCommands.restrict.name)
        .setDescription(ExpCommands.restrict.description)
        .setDMPermission(false)
        .addChannelOption(option =>
            option.setName('channels')
                .addChannelTypes(ChannelType.GuildText)
                .setDescription('Kênh riêng tư')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('roles')
                .setDescription('Role riêng tư')
                .setRequired(true)),
    async execute(interaction: any, client: Client) {
        const selectedChannel = interaction.options;
        // const selectedRole = interaction.options.getString('roles');

        // console.log(selectedRole)
        console.log(selectedChannel)

        const foundChannel = await RestrictChannel.findOne({guildId: interaction.guildId})
        if (foundChannel === null || foundChannel === undefined) {
            await RestrictChannel.collection.insertOne({
                guildId: interaction.guildId,
                guildName: interaction.member?.guild.name,
                restrictChannels: [],
                // guildId: interaction.guildId,
                // guildName: interaction.member?.guild.name,
                // textChannelId: interaction.channelId,
            })
            await interaction.followUp(messages.settingUpPaP(interaction.channelId));
            return;
        }

        await interaction.followUp({ content: 'oke'});
    }
}
