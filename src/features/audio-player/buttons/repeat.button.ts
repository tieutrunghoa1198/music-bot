import { Client } from 'discord.js';
import { BuilderID, Messages, players } from '@/core/constants/index.constant';

export default {
  customId: BuilderID.repeatSong,
  execute: async (interaction: any, client: Client) => {
    await interaction.deferReply();

    const player = players.get(interaction.guildId as string);
    if (!player) {
      await interaction.followUp(Messages.joinVoiceChannel);
      return;
    }
    player.isReplay = !player.isReplay;
    await interaction.followUp(
      Messages.replay(player.isReplay ? 'Bật' : 'Tắt'),
    );
  },
};
