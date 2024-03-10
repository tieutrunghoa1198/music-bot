import PuppeteerIntercept from '@/core/services/others/puppeteer-intercept';
import { ISlashCommand } from '@/core/interfaces/command.interface';
import { SlashCommandBuilder } from '@discordjs/builders';

export const testCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('checking player status')
    .setDMPermission(false),
  async execute(interaction: any) {
    await interaction.deferReply();

    const asd = new PuppeteerIntercept();
    await asd.updateToken();
    await interaction.followUp('Token soundcloud đã được cập nhật.');
  },
};
