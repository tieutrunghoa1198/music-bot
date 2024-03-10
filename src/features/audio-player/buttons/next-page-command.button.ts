import { Player } from '@/core/models/player.model';
import { paginationMsg } from '@/core/views/embed-messages/queue.embed';
import {
  createSelectedTracks,
  numberOfPageSelectMenu,
} from '@/core/views/select-menu/selectMenu';
import { generateButton } from '@/core/views/buttons';
import { players } from '@/core/constants/common.constant';
import { Messages } from '@/core/constants/messages.constant';
import { PlayerQueue } from '@/core/constants/player-queue.constant';
import { IButtonCommand } from '@/core/interfaces/command.interface';

export const nextPageCommandButton: IButtonCommand = {
  customId: 'next',
  execute: async (interaction: any) => {
    await interaction.deferReply();

    const player = players.get(interaction.guildId as string) as Player;
    if (!player) {
      await interaction.followUp(Messages.joinVoiceChannel);
      return;
    }
    if (!interaction.message.embeds[0].footer) {
      console.log('there is no footer');
      return;
    }
    try {
      const footer = interaction.message.embeds[0].footer;
      const currentPage = parseInt(
        footer.text.split(':')[1].trim().split('/')[0],
        10,
      );
      const maxPage = parseInt(
        footer.text.split(':')[1].trim().split('/')[1],
        10,
      );
      const nextPage = currentPage + 1;
      const msg = await paginationMsg(player, nextPage);

      if (msg?.embedMessage === null || msg?.embedMessage === undefined) {
        return;
      }

      const btn = await generateButton(nextPage, maxPage);
      const message = await interaction.channel.messages.fetch(
        interaction.message.id,
      );
      message.delete().catch((error: any) => {
        // Only log the error if it is not an Unknown Message error
        if (error) {
          console.error('Failed to delete the message:', error);
          return;
        }
      });
      interaction.followUp({
        embeds: [msg.embedMessage],
        components: [
          createSelectedTracks(msg?.tracks),
          numberOfPageSelectMenu(
            player.queue.length / PlayerQueue.MAX_PER_PAGE,
            nextPage,
          ),
          btn,
        ],
      });
    } catch (e) {
      console.log(e, 'next btn error');
      await interaction.followUp('Max page!');
    }
  },
};
