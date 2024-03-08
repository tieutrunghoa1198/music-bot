import { SlashCommandBuilder } from '@discordjs/builders';
import { Player } from '@/core/models/player.model';
import { Client } from 'discord.js';
import { InteractionNotification } from '@/core/services/noti/interaction-notification';
import {
  Messages,
  MusicCommands,
  players,
} from '@/core/constants/index.constant';
import { COMMAND_MUSIC } from '@/core/commands/music.command';

export default {
  data: COMMAND_MUSIC.showList.data,
  async execute(interaction: any, client: Client) {
    const player = players.get(interaction.guildId as string) as Player;
    if (!player) {
      await interaction.followUp(Messages.joinVoiceChannel);
      return;
    }
    if (player.queue.length === 0) {
      await interaction.followUp(Messages.emptyQueue);
      return;
    }
    await InteractionNotification.getInstance().showQueue(interaction, player);
    return;
  },
};
