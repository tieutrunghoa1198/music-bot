import {botClient} from '@/bot-client';
import {Message} from 'discord.js';
import MessageMusicController from '@/features/audio-player/cmd-message/play.msg';
import {interactionCreateStream} from "@/core/services/others/interaction-create.service";
import MessageRestrictController from "@/features/moderating-message/cmd-message/restrict.msg";

export const broadCastAudioInteraction = () => {

  botClient.on('messageCreate', (message: Message) => {
    MessageMusicController.handleLink(message);
    MessageRestrictController.restrict(message);
  });

  botClient.on('interactionCreate', async (interaction: any) => {
    const handlers = [
      { check: interaction.isCommand, handle: interactionCreateStream.emitInteractionSlashCommand },
      { check: interaction.isSelectMenu, handle: interactionCreateStream.emitInteractionSelectMenu },
      { check: interaction.isButton, handle: interactionCreateStream.emitInteractionButton },
      { check: interaction.isAutocomplete, handle: interactionCreateStream.emitInteractionAutoComplete },
    ];

    for (const { check, handle } of handlers) {
      if (check.call(interaction)) {
        handle.call(interactionCreateStream, interaction);
        break;
      }
    }
  });

};
