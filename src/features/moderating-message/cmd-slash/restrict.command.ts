import * as Constant from '@/core/constants/index.constant';
import { Client } from 'discord.js';
import { RestrictChannel } from '@/core/mongodb/restrict.model';
import { COMMAND_MODERATING_MESSAGE } from '@/core/commands/moderating-message.command';

export default {
  data: COMMAND_MODERATING_MESSAGE.restrict.data,
  async execute(interaction: any, client: Client) {
    await interaction.deferReply();

    const selectedChannel = interaction.options;
    console.log(selectedChannel);

    const foundChannel = await RestrictChannel.findOne({
      guildId: interaction.guildId,
    });
    if (foundChannel === null || foundChannel === undefined) {
      await RestrictChannel.collection.insertOne({
        guildId: interaction.guildId,
        guildName: interaction.member?.guild.name,
        restrictChannels: [],
      });
      await interaction.followUp(
        Constant.Messages.settingUpPaP(interaction.channelId),
      );
      return;
    }

    await interaction.followUp({ content: 'oke' });
  },
};
