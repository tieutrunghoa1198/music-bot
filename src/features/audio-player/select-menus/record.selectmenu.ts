import * as Constant from '@/core/constants/index.constant';
import { players } from '@/core/constants/index.constant';
import { Player } from '@/core/models/player.model';
import { paginationMsg } from '@/core/views/embed-messages/queue.embed';
import { AudioPlayerComponent } from '@/core/views/group/audio-player.component';
import { ISelectButtonCommand } from '@/core/interfaces/command.interface';

export const recordSelectMenu: ISelectButtonCommand = {
  customId: Constant.BuilderID.pageSelectMenu,
  execute: async (interaction: any) => {
    await interaction.deferReply();

    if (interaction.customId !== Constant.BuilderID.pageSelectMenu) {
      return;
    }

    const player = players.get(interaction.guildId) as Player;
    if (!player) {
      await interaction.followUp(Constant.Messages.joinVoiceChannel);
      return;
    }

    try {
      if (player.queue.length > 0) {
        const result = await interaction.values[0];
        const msg = await paginationMsg(player, parseInt(result));
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
        await interaction.followUp({
          embeds: [msg?.embedMessage],
          components: AudioPlayerComponent(msg, player, parseInt(result))
            .components,
        });
      } else {
        interaction.followUp(Constant.Messages.emptyQueue);
      }
    } catch (e) {
      console.log(e);
      interaction.followUp(Constant.Messages.error);
    }
  },
};
