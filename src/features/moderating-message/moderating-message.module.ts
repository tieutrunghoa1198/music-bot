import { botClient } from '@/bot-client';
import { Message } from 'discord.js';
import MessageRestrictController from '@/features/moderating-message/cmd-message/restrict.msg';
import { MODERATING_MESSAGE_COMMAND_MAP } from '@/core/commands/moderating-message.command';

export const ModeratingMessageModule = () => {
  botClient.on('messageCreate', async (message: Message) => {
    await MessageRestrictController.restrict(message);
  });

  botClient.on('interactionCreate', async (interaction: any) => {
    const command = MODERATING_MESSAGE_COMMAND_MAP.get(interaction.commandName);

    switch (true) {
      case interaction.isCommand():
        if (command === undefined) return;
        await command.execute(interaction);
        break;
    }
  });
};
