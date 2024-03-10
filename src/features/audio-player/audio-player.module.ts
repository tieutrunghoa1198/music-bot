import { botClient } from '@/bot-client';
import { Message } from 'discord.js';
import MessageMusicController from '@/features/audio-player/cmd-message/play.msg';
import { ephemeralResponse } from '@/core/utils/common.util';
import * as Constant from '@/core/constants/index.constant';
import {
  BUTTON_AUDIO_PLAYER_MAP,
  SELECT_MENU_AUDIO_PLAYER_MAP,
} from '@/features/audio-player/constants/map.constant';
import { MUSIC_COMMAND_MAP } from '@/core/commands/music.command';

export const AudioPlayerModule = () => {
  /**
   * @desc handle message create event
   */
  botClient.on('messageCreate', async (message: Message) => {
    await MessageMusicController.handleLink(message);
  });

  /**
   * @desc handle interaction create event but require to join voice channel
   */
  botClient.on('interactionCreate', async (interaction: any) => {
    const audioPlayerSlashCommand = MUSIC_COMMAND_MAP.get(
      interaction.commandName,
    );
    const selectMenu = SELECT_MENU_AUDIO_PLAYER_MAP.get(interaction.customId);
    const buttonCommand = BUTTON_AUDIO_PLAYER_MAP.get(interaction.customId);

    // ----------------------------

    const isUserInVoiceChannel = interaction.member.voice.channel;
    if (!isUserInVoiceChannel) {
      await ephemeralResponse(
        interaction,
        Constant.Messages.userJoinVoiceChannel(interaction.user.toString()),
      );
      return;
    }

    // ----------------------------

    switch (true) {
      case interaction.isCommand():
        if (audioPlayerSlashCommand === undefined) return;
        await audioPlayerSlashCommand.execute(interaction);
        break;

      case interaction.isSelectMenu():
        if (selectMenu === undefined) return;
        await selectMenu.execute(interaction);
        break;

      case interaction.isButton():
        if (buttonCommand === undefined) return;
        await buttonCommand.execute(interaction);
        break;
    }
  });

  /**
   * @desc only handle interaction create only
   */
  botClient.on('interactionCreate', async (interaction: any) => {
    const audioPlayerSlashCommand = MUSIC_COMMAND_MAP.get(
      interaction.commandName,
    );

    // -----------------------------

    switch (true) {
      case interaction.isAutocomplete():
        if (audioPlayerSlashCommand === undefined) return;
        if (
          audioPlayerSlashCommand.hasAutoComplete &&
          audioPlayerSlashCommand.autocomplete
        )
          await audioPlayerSlashCommand.autocomplete(interaction);
        break;
    }
  });
};
