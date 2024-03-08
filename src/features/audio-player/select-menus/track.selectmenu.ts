import { Player } from '@/core/models/player.model';
import * as Constant from '@/core/constants/index.constant';
import { players } from '@/core/constants/index.constant';
import { InteractionNotification } from '@/core/services/noti/interaction-notification';
import { QueueItem } from '@/core/interfaces/player.interface';

export default {
  customId: Constant.BuilderID.trackSelectMenu,
  execute: async (interaction: any) => {
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
        await InteractionNotification.getInstance().showNowPlaying(
          player,
          interaction,
        );
        return;
      }
      const nowPlaying = (await player.skipByTitle(
        interaction.values[0],
      )) as QueueItem;
      if (nowPlaying === null) {
        await interaction.followUp(Constant.Messages.cantFindAnyThing);
        return;
      }
      await InteractionNotification.getInstance().showNowPlaying(
        player,
        interaction,
      );
    } else {
      await interaction.followUp(Constant.Messages.emptyQueue);
    }
  },
};
