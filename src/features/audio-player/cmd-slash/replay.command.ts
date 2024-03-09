import {
  Messages,
  MusicCommands,
  players,
} from '@/core/constants/index.constant';
import { ICommand } from '@/features/audio-player/interfaces/command.interface';
import { SlashCommandBuilder } from '@discordjs/builders';

export const replayCommand: ICommand = {
  data: new SlashCommandBuilder()
    .setName(MusicCommands.replay.name)
    .setDescription(MusicCommands.replay.description)
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('replay')
        .setDescription('on/off')
        .setRequired(true)
        .addChoices(
          { name: 'Bật', value: 'true' },
          { name: 'Tắt', value: 'false' },
        ),
    ),
  async execute(interaction: any) {
    await interaction.deferReply();

    const isReplay = JSON.parse(
      interaction.options.getString('replay'),
    ) as boolean;
    const player = players.get(interaction.guildId as string);
    if (!player) {
      await interaction.followUp(Messages.joinVoiceChannel);
      return;
    }
    player.isReplay = isReplay;
    await interaction.followUp(Messages.replay(isReplay ? 'Bật' : 'Tắt'));
  },
};
