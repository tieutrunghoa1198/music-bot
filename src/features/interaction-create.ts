import { HandleAudioInteraction } from './audio-player/handle-audio-interaction';
import { handleAudioSelectMenu } from './audio-player/handle-audio-select-menu';
import { handleAudioButtons } from './audio-player/handle-audio-buttons';
import { HandleModeratingMessageInteraction } from '@/features/moderating-message/handle-moderating-message-interaction';
import { botClient } from '@/bot-client';

export const InteractionCreate = async () => {
  botClient.on('interactionCreate', async (interaction: any) => {
    if (interaction.isCommand()) {
      await HandleAudioInteraction.slashCommand(interaction);
      await HandleModeratingMessageInteraction.slashCommand(interaction);
    }

    if (interaction.isSelectMenu()) {
      await interaction.deferUpdate();
      await handleAudioSelectMenu(interaction);
    }

    if (interaction.isButton()) {
      // await interaction.deferUpdate();
      await handleAudioButtons(interaction);
    }

    if (interaction.isAutocomplete()) {
      await HandleAudioInteraction.autoComplete(interaction);
    }
  });
};
