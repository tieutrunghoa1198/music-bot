import { ISlashCommand } from '@/core/interfaces/command.interface';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  formatTimeInput,
  isValidTimeInput,
} from '@/core/utils/format-time.util';
import { players } from '@/core/constants/common.constant';
import { Messages } from '@/core/constants/messages.constant';

export const seekCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Tua nhac')
    .addStringOption((option) =>
      option
        .setName('input')
        .setDescription(
          'Định dạng nhập (dd:hh:mm:ss) | ví dụ bài hát dài 3:40 -> nhập "2:40" để tua đến 2 phút 40 giây',
        )
        .setRequired(true),
    ),
  async execute(interaction: any) {
    await interaction.deferReply();

    const second = formatTimeInput(interaction.options.getString('input'));

    await interaction.followUp(
      `Raw: ${interaction.options.getString('input')} | Converted: ${second} | Result: ${isValidTimeInput(interaction.options.getString('input'))}`,
    );

    const player = players.get(interaction.guildId as string);

    if (!player) {
      await interaction.followUp(Messages.joinVoiceChannel);
      return;
    }

    await player.seek(formatTimeInput(interaction.options.getString('input')));
    await interaction.followUp('cool');
  },
};
