import { SlashCommandBuilder } from '@discordjs/builders';
import { Client } from 'discord.js';
import {
  Messages,
  MusicCommands,
  players,
} from '@/core/constants/index.constant';

export default {
  data: new SlashCommandBuilder()
    .setName(MusicCommands.clear.name)
    .setDescription(MusicCommands.clear.description)
    .setDMPermission(false),
  async execute(interaction: any, client: Client) {
    const player = players.get(interaction.guildId as string);
    if (!player?.voiceConnection) {
      await interaction.followUp(Messages.playerNotCreated);
    } else {
      player.queue = [];
      await interaction.followUp(Messages.emptyQueue);
    }
  },
};
