import { players } from '@/core/constants/index.constant';
import { ISlashCommand } from '@/core/interfaces/command.interface';
import { SlashCommandBuilder } from '@discordjs/builders';

export const statusCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('checking player status')
    .setDMPermission(false),
  async execute(interaction: any) {
    await interaction.deferReply();

    const player = players.get(interaction.guildId as string);
    if (!player) {
      await interaction.followUp('Player chưa được khởi tạo');
      return;
    }

    await interaction.followUp(JSON.stringify(player.toJSON()));
  },
};
