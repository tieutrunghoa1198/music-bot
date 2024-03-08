import { SlashCommandBuilder } from '@discordjs/builders';
import { Client } from 'discord.js';
import {
  Messages,
  MusicCommands,
  players,
} from '@/core/constants/index.constant';
import { COMMAND_MUSIC } from '@/core/commands/music.command';

export default {
  data: COMMAND_MUSIC.leave.data,
  async execute(interaction: any, client: Client) {
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
