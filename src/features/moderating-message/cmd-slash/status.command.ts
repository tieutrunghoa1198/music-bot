import {SlashCommandBuilder} from '@discordjs/builders';
import {Client} from 'discord.js';
import * as Constant from '@/core/constants/index.constant';
import {players} from '@/core/models/abstract-player.model';

export default {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('checking player status')
    .setDMPermission(false),
  async execute(interaction: any, _: Client) {
    const player = players.get(interaction.guildId as string);
    if (!player) {
      await interaction.followUp(Constant.Messages.error);
      return;
    }
    console.log(player);
  },
};
