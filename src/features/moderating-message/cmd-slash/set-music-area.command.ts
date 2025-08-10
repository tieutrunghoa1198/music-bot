import { Player } from '@/core/services/player.service';
import * as Constant from '@/core/constants/index.constant';
import { players } from '@/core/constants/index.constant';
import { MusicAreaRepository } from '@/core/database/repositories/music-area.repository';
import { ISlashCommand } from '@/core/interfaces/command.interface';
import { SlashCommandBuilder } from '@discordjs/builders';

export const setMusicAreaCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName(Constant.ExpCommands.setMusicArea.name)
    .setDescription(Constant.ExpCommands.setMusicArea.description)
    .setDMPermission(false),
  async execute(interaction: any) {
    await interaction.deferReply();

    const player = players.get(interaction.guildId as string) as Player;
    if (!player) {
      await interaction.followUp(Constant.Messages.joinVoiceChannel);
      return;
    }
    const repository = new MusicAreaRepository();
    const musicAreaChannel = await repository.findByGuildId(
      interaction.guildId,
    );
    if (musicAreaChannel === null || musicAreaChannel === undefined) {
      await repository.insert({
        guildId: interaction.guildId,
        guildName: interaction.member?.guild.name,
        textChannelId: interaction.channelId,
      });
      await interaction.followUp(
        Constant.Messages.settingUpPaP(interaction.channelId),
      );
    } else {
      await repository.updateTextChannelId(
        interaction.guildId,
        interaction.channelId,
      );
      await interaction.followUp(
        Constant.Messages.settingUpPaP(interaction.channelId),
      );
    }
    return;
  },
};
