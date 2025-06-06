import {
  Messages,
  MusicCommands,
  players,
} from '@/core/constants/index.constant';
import { ISlashCommand } from '@/core/interfaces/command.interface';
import { SlashCommandBuilder } from '@discordjs/builders';
import {logger} from "@/core/utils/logger.util";

export const skipCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName(MusicCommands.skip.name)
    .setDescription(MusicCommands.skip.description)
    .setDMPermission(false),
  async execute(interaction: any) {
    await interaction.deferReply();

    try {
      const player = players.get(interaction.guildId as string);

      if (!player) {
        await interaction.followUp(Messages.playerNotFound);
        await interaction.followUp(Messages.joinVoiceChannel);
        return;
      }

      if (player?.queueManager.queue.length === 0) {
        await interaction.followUp('the queue is empty');
        return;
      }

      if (player?.queueManager.isReplay === true) player.queueManager.isReplay = false;

      player?.queueManager.skip();
      await interaction.followUp(
          Messages.skippedSong({
            title: player.queueManager.currentSong?.song.title,
            requester: player.queueManager.currentSong?.requester,
          }),
      );
    } catch (e) {
      logger.error(e + ' | error at skip command');
      await interaction.followUp('error');
    }
  },
};
