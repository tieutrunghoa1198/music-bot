import { Client } from 'discord.js';
import * as Constant from '@/core/constants/index.constant';
import { players } from '@/core/constants/index.constant';
import { COMMAND_MODERATING_MESSAGE } from '@/core/commands/moderating-message.command';

export default {
  data: COMMAND_MODERATING_MESSAGE.status.data,
  async execute(interaction: any, _: Client) {
    await interaction.deferReply();

    const player = players.get(interaction.guildId as string);
    if (!player) {
      await interaction.followUp(Constant.Messages.error);
      return;
    }
    console.log(player);
  },
};
