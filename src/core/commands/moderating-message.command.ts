import { SlashCommandBuilder } from '@discordjs/builders';
import { ExpCommands } from '@/core/constants/music-commands.constant';
import * as Constant from '@/core/constants/index.constant';
import { ChannelType } from 'discord-api-types/v9';

export const COMMAND_MODERATING_MESSAGE = {
  cleanMessage: {
    data: new SlashCommandBuilder()
      .setName(ExpCommands.cleanMessage.name)
      .setDescription(ExpCommands.cleanMessage.description)
      .setDMPermission(false)
      .toJSON(),
  },

  restrict: {
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
        option
          .setName('roles')
          .setDescription('Role riêng tư')
          .setRequired(true),
      )
      .toJSON(),
  },

  musicArea: {
    data: new SlashCommandBuilder()
      .setName(Constant.ExpCommands.setMusicArea.name)
      .setDescription(Constant.ExpCommands.setMusicArea.description)
      .setDMPermission(false)
      .toJSON(),
  },

  status: {
    data: new SlashCommandBuilder()
      .setName('status')
      .setDescription('checking player status')
      .setDMPermission(false)
      .toJSON(),
  },

  test: {
    data: new SlashCommandBuilder()
      .setName('test')
      .setDescription('checking player status')
      .setDMPermission(false)
      .toJSON(),
  },
};
