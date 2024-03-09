import * as Constant from '@/core/constants/index.constant';
import { players } from '@/core/constants/index.constant';
import { Player } from '@/core/models/player.model';
import { QueueItem } from '@/core/interfaces/player.interface';
import { InteractionNotification } from '@/core/services/noti/interaction-notification';

export const trackSelectMenu = {
  customId: Constant.BuilderID.trackSelectMenu,
  execute: async (interaction: any) => {
    await interaction.deferReply();

    const player = players.get(interaction.guildId) as Player;
    if (!player) {
      await interaction.followUp(Constant.Messages.joinVoiceChannel);
      return;
    }

    if (player.queue.length > 0) {
      if (player?.isReplay === true) player.isReplay = false;
      const result = await interaction.values[0].split(
        Constant.GlobalConstants.specialSeparator,
      );
      if (result?.length > 1) {
        const nowPlaying = (await player.skipByTitle(result[0])) as QueueItem;
        if (nowPlaying === null) {
          await interaction.followUp(Constant.Messages.cantFindAnyThing);
          return;
        }
        await InteractionNotification.getInstance().showNowPlaying(interaction);
        return;
      }
      const nowPlaying = (await player.skipByTitle(
        interaction.values[0],
      )) as QueueItem;
      if (nowPlaying === null) {
        await interaction.followUp(Constant.Messages.cantFindAnyThing);
        return;
      }
      await InteractionNotification.getInstance().showNowPlaying(interaction);
    } else {
      await interaction.followUp(Constant.Messages.emptyQueue);
    }
  },
};
