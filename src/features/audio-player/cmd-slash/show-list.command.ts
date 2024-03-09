import { Player } from '@/core/models/player.model';
import { InteractionNotification } from '@/core/services/noti/interaction-notification';
import {
  Messages,
  MusicCommands,
  players,
} from '@/core/constants/index.constant';
import { ICommand } from '@/features/audio-player/interfaces/command.interface';
import { SlashCommandBuilder } from '@discordjs/builders';

export const showListCommand: ICommand = {
  data: new SlashCommandBuilder()
    .setName(MusicCommands.listQueue.name)
    .setDescription(MusicCommands.listQueue.description)
    .setDMPermission(false),
  async execute(interaction: any) {
    await interaction.deferReply();

    const player = players.get(interaction.guildId as string) as Player;
    if (!player) {
      await interaction.followUp(Messages.joinVoiceChannel);
      return;
    }
    if (player.queue.length === 0) {
      await interaction.followUp(Messages.emptyQueue);
      return;
    }
    await InteractionNotification.getInstance().showQueue(interaction);
    return;
  },
};
