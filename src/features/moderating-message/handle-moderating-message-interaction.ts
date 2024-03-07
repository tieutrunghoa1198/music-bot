import {Client} from 'discord.js';
import {DeployCommands} from '@/core/utils/deploy-commands.util';
import {FOLDER_FEATURE_NAME} from '@/features/audio-player/constants/common.constant';
import {logger} from '@/core/utils/logger.util';

export class HandleModeratingMessageInteraction {
  public static async slashCommand(interaction: any, client: Client) {
    try {
      const myCommand = DeployCommands.extractCommands(__dirname, '.command', [
        FOLDER_FEATURE_NAME.CMD_SLASH,
      ]);

      if (!myCommand.length) throw new Error('command length = 0');

      for (const command of myCommand) {
        command.data.name === interaction.commandName &&
          (await command.execute(interaction, client));
        if (command.data.name === interaction.commandName) {
          await command.execute(interaction, client);
        }
      }
    } catch (e: any) {
      logger.error(
        'handle moderating message HandleModeratingMessageInteraction.slashCommand(_, _) - command error',
      );
      if (interaction.deletable) {
        await interaction.followUp(e.toString());
      }
    }
  }
}
