import { botClient } from '@/bot-client';
import { Message } from 'discord.js';
import { HandleModeratingMessageInteraction } from '@/features/moderating-message/handle-moderating-message-interaction';
import MessageRestrictController from '@/features/moderating-message/cmd-message/restrict.msg';

export const ModeratingMessageModule = () => {
  botClient.on('messageCreate', async (message: Message) => {
    await MessageRestrictController.restrict(message);
  });

  botClient.on('interactionCreate', async (interaction: any) => {
    await HandleModeratingMessageInteraction.slashCommand(interaction);
  });
};
