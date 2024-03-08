import { SlashCommandBuilder } from '@discordjs/builders';
import { Client } from 'discord.js';
import {
  Messages,
  MusicCommands,
  players,
} from '@/core/constants/index.constant';
import { COMMAND_MUSIC } from '@/core/commands/music.command';

export default {
  data: COMMAND_MUSIC.replay.data,
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
