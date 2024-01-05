import {SlashCommandBuilder} from "@discordjs/builders";
import * as Constant from '@/constants/index.constant'
import {Client} from "discord.js";
import {ChannelType} from "discord-api-types/v9";
import {RestrictChannel} from "@/mongodb/restrict.model";

export default {
    data: new SlashCommandBuilder()
        .setName(Constant.ExpCommands.restrict.name)
        .setDescription(Constant.ExpCommands.restrict.description)
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
        console.log(selectedChannel)

        const foundChannel = await RestrictChannel.findOne({guildId: interaction.guildId})
        if (foundChannel === null || foundChannel === undefined) {
            await RestrictChannel.collection.insertOne({
                guildId: interaction.guildId,
                guildName: interaction.member?.guild.name,
                restrictChannels: [],
            })
            await interaction.followUp(Constant.Messages.settingUpPaP(interaction.channelId));
            return;
        }

        await interaction.followUp({ content: 'oke'});
    }
}
