import { Client } from 'discord.js';
import { HandleAudioInteraction } from './audio-player/handle-audio-interaction';
import { handleAudioSelectmenu } from './audio-player/handle-audio-selectmenu';
import { handleAudioButtons } from './audio-player/handle-audio-buttons';

export const InteractionCreate = async (client: Client) => {
  client.on('interactionCreate', async (interaction: any) => {
    if (interaction.isCommand()) {
      await HandleAudioInteraction.slashCommand(interaction, client);
    }

    if (interaction.isSelectMenu()) {
      await interaction.deferUpdate();
      await handleAudioSelectmenu(interaction, client);
    }

    if (interaction.isButton()) {
      await interaction.deferUpdate();
      await handleAudioButtons(interaction, client);
    }

    if (interaction.isAutocomplete()) {
      await HandleAudioInteraction.autoComplete(interaction, client);
    }
  });
};
