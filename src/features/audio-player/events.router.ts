import {botClient} from '@/bot-client';
import {Message} from 'discord.js';
import MessageMusicController from '@/features/audio-player/cmd-message/play.msg';
import {interactionCreateStream} from "@/core/services/others/interaction-create.service";
import MessageRestrictController from "@/features/moderating-message/cmd-message/restrict.msg";
import {players} from "@/core/constants/common.constant";
import {logger} from "@/core/utils/logger.util";

export const EventsRouter = () => {

  botClient.on('messageCreate', (message: Message) => {
    MessageMusicController.handleLink(message);
    MessageRestrictController.restrict(message);
  });

  botClient.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.member?.id !== botClient.user?.id) return;

    if (oldState.channelId && !newState.channelId) {
      logger.info(`Bot was disconnected from voice channel | GuildId: ${oldState.guild.id}!`);
      const player = players.get(oldState.guild.id);
      if (player) player.leave();
    }
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
