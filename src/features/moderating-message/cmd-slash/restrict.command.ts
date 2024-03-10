import * as Constant from '@/core/constants/index.constant';
import { RestrictChannel } from '@/core/mongodb/restrict.model';
import { ISlashCommand } from '@/core/interfaces/command.interface';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType } from 'discord-api-types/v9';

export const restrictCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName(Constant.ExpCommands.restrict.name)
    .setDescription(Constant.ExpCommands.restrict.description)
    .setDMPermission(false)
    .addChannelOption((option) =>
      option
        .setName('channels')
        .addChannelTypes(ChannelType.GuildText)
        .setDescription('Kênh riêng tư')
        .setRequired(true),
    )
    .addRoleOption((option) =>
      option.setName('roles').setDescription('Role riêng tư').setRequired(true),
    ),
  async execute(interaction: any) {
    await interaction.deferReply();

    const selectedChannel = interaction.options;

    const foundChannel = await RestrictChannel.findOne({
      guildId: interaction.guildId,
    });
    if (foundChannel === null || foundChannel === undefined) {
      await RestrictChannel.collection.insertOne({
        guildId: interaction.guildId,
        guildName: interaction.member?.guild.name,
        restrictChannels: [],
      });
      await interaction.followUp(
        Constant.Messages.settingUpPaP(interaction.channelId),
      );
      return;
    }

    await interaction.followUp({ content: 'oke' });
  },
};
