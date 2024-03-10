import {
  Messages,
  MusicCommands,
  players,
} from '@/core/constants/index.constant';
import { ISlashCommand } from '@/core/interfaces/command.interface';
import { SlashCommandBuilder } from '@discordjs/builders';

export const leaveCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName(MusicCommands.leave.name)
    .setDescription(MusicCommands.leave.description)
    .setDMPermission(false),
  async execute(interaction: any) {
    await interaction.deferReply();

    const player = players.get(interaction.guildId as string);
    if (!player) {
      await interaction.followUp(Messages.playerNotCreated);
      return;
    } else {
      player.leave();
      await interaction.followUp(Messages.leaved);
    }
  },
};
