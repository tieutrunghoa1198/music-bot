import { COMMAND_MUSIC } from '@/core/commands/music.command';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { COMMAND_MODERATING_MESSAGE } from '@/core/commands/moderating-message.command';
import { logger } from '@/core/utils/logger.util';

export const deployCommandUtil = () => {
  const listCommand: any[] = [];

  // Put your command object here to push to listCommand for deployment to Discord API

  Object.entries(COMMAND_MUSIC).forEach(([_, value]) => {
    listCommand.push(value.data);
  });

  Object.entries(COMMAND_MODERATING_MESSAGE).forEach(([_, value]) => {
    listCommand.push(value.data);
  });

  // ---------------------------------------------------

  new REST({ version: '9' })
    .setToken(process.env.TOKEN as any)
    .put(Routes.applicationCommands(process.env.clientId as any), {
      body: listCommand,
    })
    .catch((e) => {
      logger.error(e);
    });
};
