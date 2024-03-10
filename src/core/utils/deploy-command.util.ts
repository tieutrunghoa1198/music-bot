import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { logger } from '@/core/utils/logger.util';
import { MusicCommand } from '@/core/commands/music.command';
import { ModeratingMessageCommand } from '@/core/commands/moderating-message.command';

export const deployCommandUtil = () => {
  const listCommand: any[] = [];

  // Put your command object here to push to listCommand for deployment to Discord API

  Object.entries(MusicCommand).forEach((value) => {
    listCommand.push(value[1].data.toJSON());
  });

  Object.entries(ModeratingMessageCommand).forEach((value) => {
    listCommand.push(value[1].data.toJSON());
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
