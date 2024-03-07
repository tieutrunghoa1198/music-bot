import {Client} from 'discord.js';
import {ephemeralResponse} from '@/core/utils/common.util';
import {DeployCommands} from '@/core/utils/deploy-commands.util';
import {Messages} from '@/core/constants/messages.constant';
import {FOLDER_FEATURE_NAME} from '@/features/audio-player/constants/common.constant';

export const handleAudioButtons = async (interaction: any, client: Client) => {
  try {
    const condition = interaction.member.voice.channel;
    if (!condition) {
      await ephemeralResponse(
        interaction,
        Messages.userJoinVoiceChannel(interaction.user.toString()),
      );
      return;
    }
    const myButtons = DeployCommands.extractCommands(__dirname, '.button', [
      FOLDER_FEATURE_NAME.BUTTONS,
    ]);
    if (!myButtons.length) throw new Error();
    for (const button of myButtons) {
      if (button.customId === interaction.customId) {
        await button.execute(interaction, client);
      }
    }
  } catch (e: any) {
    console.log(e, 'mvc Button error');
    await interaction.followUp(Messages.error + 'mvc Button error');
  }
};
