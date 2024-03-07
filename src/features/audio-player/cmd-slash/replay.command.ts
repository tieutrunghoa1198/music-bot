import { SlashCommandBuilder } from '@discordjs/builders';
import { Client } from 'discord.js';
import { players } from '@/core/models/abstract-player.model';
import { Messages, MusicCommands } from '@/core/constants/index.constant';

export default {
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
  async execute(interaction: any, client: Client) {
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
