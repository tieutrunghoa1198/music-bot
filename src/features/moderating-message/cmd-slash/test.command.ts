import PuppeteerIntercept from '@/core/services/others/puppeteer-intercept';
import { COMMAND_MODERATING_MESSAGE } from '@/core/commands/moderating-message.command';

export default {
  data: COMMAND_MODERATING_MESSAGE.test.data,
  async execute(interaction: any) {
    await interaction.deferReply();

    const asd = new PuppeteerIntercept();
    await asd.updateToken();
    await interaction.followUp('Token soundcloud đã được cập nhật.');
  },
};
