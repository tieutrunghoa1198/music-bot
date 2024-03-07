import { SlashCommandBuilder } from '@discordjs/builders';
import { Client } from 'discord.js';
import PuppeteerIntercept from '@/core/services/others/puppeteer-intercept';

export default {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('checking player status')
    .setDMPermission(false),
  async execute(interaction: any, client: Client) {
    const asd = new PuppeteerIntercept();
    await asd.updateToken();
    await interaction.followUp('Token soundcloud đã được cập nhật.');
  },
};
