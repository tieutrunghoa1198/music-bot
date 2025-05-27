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
      if (player?.queue.length === 0) {
        await interaction.followUp('the queue is empty');
      } else {
        if (player?.isReplay === true) player.isReplay = false;
        player?.skip();
        await interaction.followUp(
          Messages.skippedSong({
            title: player.playing?.song.title,
            requester: player.playing?.requester,
          }),
        );
      }
    } catch (e) {
      logger.error(e);
      await interaction.followUp('erro');
    }
  },
};
