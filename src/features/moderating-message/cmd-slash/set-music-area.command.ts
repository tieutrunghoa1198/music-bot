import { Player } from '@/core/models/player.model';
import * as Constant from '@/core/constants/index.constant';
import { players } from '@/core/constants/index.constant';
import { MusicAreas } from '@/core/mongodb/music-area.model';
import { Client } from 'discord.js';
import { COMMAND_MODERATING_MESSAGE } from '@/core/commands/moderating-message.command';

export default {
  data: COMMAND_MODERATING_MESSAGE.musicArea.data,
  async execute(interaction: any, client: Client) {
    await interaction.deferReply();

    const player = players.get(interaction.guildId as string) as Player;
    if (!player) {
      await interaction.followUp(Constant.Messages.joinVoiceChannel);
      return;
    }

    const musicAreaChannel = await MusicAreas.findOne({
      guildId: interaction.guildId,
    });
    if (musicAreaChannel === null || musicAreaChannel === undefined) {
      await MusicAreas.collection.insertOne({
        guildId: interaction.guildId,
        guildName: interaction.member?.guild.name,
        textChannelId: interaction.channelId,
      });
      await interaction.followUp(
        Constant.Messages.settingUpPaP(interaction.channelId),
      );
    } else {
      await MusicAreas.collection.updateOne(
        { guildId: interaction.guildId },
        { $set: { textChannelId: interaction.channelId } },
      );
      await interaction.followUp(
        Constant.Messages.settingUpPaP(interaction.channelId),
      );
    }
    return;
  },
};
