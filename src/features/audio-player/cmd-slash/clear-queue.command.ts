import {
  Messages,
  MusicCommands,
  players,
} from '@/core/constants/index.constant';
import { ISlashCommand } from '@/core/interfaces/command.interface';
import { SlashCommandBuilder } from '@discordjs/builders';

export const clearQueueCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName(MusicCommands.clear.name)
    .setDescription(MusicCommands.clear.description)
    .setDMPermission(false),
  async execute(interaction: any) {
    await interaction.deferReply();

    const player = players.get(interaction.guildId as string);

    if (!player?.voiceConnectionManager.voiceConnection) {
      await interaction.followUp(Messages.playerNotCreated);
      return;
    }

    player.queueManager.clearQueue();
    await interaction.followUp(Messages.emptyQueue);
  },
};
