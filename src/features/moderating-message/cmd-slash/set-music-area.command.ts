import {SlashCommandBuilder} from '@discordjs/builders';
import {Player} from '@/core/models/player';
import * as Constant from '@/core/constants/index.constant';
import {MusicAreas} from '@/core/mongodb/music-area.model';
import {Client} from 'discord.js';
import {players} from '@/core/models/abstract-player.model';

export default {
  data: new SlashCommandBuilder()
    .setName(Constant.ExpCommands.setMusicArea.name)
    .setDescription(Constant.ExpCommands.setMusicArea.description)
    .setDMPermission(false),
  async execute(interaction: any, client: Client) {
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
