import { Client } from 'discord.js';
import { Messages, players } from '@/core/constants/index.constant';
import { COMMAND_MUSIC } from '@/core/commands/music.command';

export default {
  data: COMMAND_MUSIC.clearQueue.data,
  async execute(interaction: any, client: Client) {
    await interaction.deferReply();

    const player = players.get(interaction.guildId as string);
    if (!player?.voiceConnection) {
      await interaction.followUp(Messages.playerNotCreated);
    } else {
      player.queue = [];
      await interaction.followUp(Messages.emptyQueue);
    }
  },
};
