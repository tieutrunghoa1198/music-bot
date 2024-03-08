import * as Constant from '@/core/constants/index.constant';
import { ephemeralResponse } from '@/core/utils/common.util';
import { DeployCommands } from '@/core/utils/deploy-commands.util';
import { FOLDER_FEATURE_NAME } from '@/features/audio-player/constants/common.constant';
import { botClient } from '@/bot-client';

export const handleAudioSelectMenu = async (interaction: any) => {
  try {
    const condition = interaction.member.voice.channel;
    if (!condition) {
      await ephemeralResponse(
        interaction,
        Constant.Messages.userJoinVoiceChannel(interaction.user.toString()),
      );
      return;
    }
    const mySelectMenus = DeployCommands.extractCommands(
      __dirname,
      '.selectmenu',
      [FOLDER_FEATURE_NAME.SELECT_MENUS],
    );
    if (!mySelectMenus.length) throw new Error();
    for (const selectMenu of mySelectMenus) {
      if (selectMenu.customId === interaction.customId) {
        await selectMenu.execute(interaction, botClient);
      }
    }
  } catch (e) {
    console.log(e);
    await interaction.followUp(
      Constant.Messages.error + ': Select menu track!',
    );
  }
};
