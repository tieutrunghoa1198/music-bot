import * as Constant from '@/core/constants/index.constant';
import { players } from '@/core/constants/index.constant';
import { Player } from '@/core/services/player.service';
import { QueueItem } from '@/core/interfaces/player.interface';
import { InteractionNotification } from '@/core/services/noti/interaction-notification';
import { ISelectButtonCommand } from '@/core/interfaces/command.interface';

export const trackSelectMenu: ISelectButtonCommand = {
  customId: Constant.BuilderID.trackSelectMenu,
  execute: async (interaction: any) => {
    await interaction.deferReply();

    const player = players.get(interaction.guildId) as Player;

    if (!player) {
      await interaction.followUp(Constant.Messages.joinVoiceChannel);
      return;
    }

    if (player.queueManager.queue.length === 0) {
      await interaction.followUp(Constant.Messages.emptyQueue);
      return;
    }

    if (player?.queueManager.isReplay === true) player.queueManager.isReplay = false;

    const result = await interaction.values[0].split(Constant.GlobalConstants.specialSeparator);

    if (result?.length > 1) {
      const nowPlaying = player.queueManager.skipByTitle(result[0]);
      if (nowPlaying === null) {
        await interaction.followUp(Constant.Messages.cantFindAnyThing);
        return;
      }
      await InteractionNotification.getInstance().showNowPlaying(interaction);
      return;
    }

    const nowPlaying = player.queueManager.skipByTitle(interaction.values[0]);

    if (nowPlaying === null) {
      await interaction.followUp(Constant.Messages.cantFindAnyThing);
      return;
    }

    await InteractionNotification.getInstance().showNowPlaying(interaction);
  },
};
