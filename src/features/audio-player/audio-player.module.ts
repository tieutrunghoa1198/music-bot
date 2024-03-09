import { botClient } from '@/bot-client';
import { Message } from 'discord.js';
import MessageMusicController from '@/features/audio-player/cmd-message/play.msg';
import { ephemeralResponse } from '@/core/utils/common.util';
import * as Constant from '@/core/constants/index.constant';
import { Messages } from '@/core/constants/index.constant';
import { SELECT_MENU_AUDIO_PLAYER_MAP } from '@/features/audio-player/constants/map.constant';
import { MUSIC_COMMAND_MAP } from '@/core/commands/music.command';
import { DeployCommands } from '@/core/utils/deploy-commands.util';
import { FOLDER_FEATURE_NAME } from '@/features/audio-player/constants/common.constant';

export const AudioPlayerModule = () => {
  botClient.on('messageCreate', async (message: Message) => {
    await MessageMusicController.handleLink(message);
  });

  // require join voice features
  botClient.on('interactionCreate', async (interaction: any) => {
    const isUserInVoiceChannel = interaction.member.voice.channel;
    if (!isUserInVoiceChannel) {
      await ephemeralResponse(
        interaction,
        Constant.Messages.userJoinVoiceChannel(interaction.user.toString()),
      );
      return;
    }

    switch (true) {
      case interaction.isCommand():
        const audioPlayerSlashCommand = MUSIC_COMMAND_MAP.get(
          interaction.commandName,
        );
        if (audioPlayerSlashCommand === undefined) return;
        await audioPlayerSlashCommand.execute(interaction);
        break;

      case interaction.isSelectMenu():
        const selectMenu = SELECT_MENU_AUDIO_PLAYER_MAP.get(
          interaction.customId,
        );
        if (selectMenu === undefined) return;
        await selectMenu.execute(interaction);
        break;

      case interaction.isButton():
        try {
          const myButtons = DeployCommands.extractCommands(
            __dirname,
            '.button',
            [FOLDER_FEATURE_NAME.BUTTONS],
          );
          if (!myButtons.length) throw new Error();
          for (const button of myButtons) {
            if (button.customId === interaction.customId) {
              await button.execute(interaction, botClient);
            }
          }
        } catch (e: any) {
          console.log(e, 'mvc Button error');
          await interaction.followUp(Messages.error + 'mvc Button error');
        }
        break;
    }
  });

  botClient.on('interactionCreate', async (interaction: any) => {
    switch (true) {
      case interaction.isAutocomplete():
        const audioPlayerSlashCommand = MUSIC_COMMAND_MAP.get(
          interaction.commandName,
        );
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
