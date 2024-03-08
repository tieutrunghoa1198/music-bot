import { SlashCommandBuilder } from '@discordjs/builders';
import { Client } from 'discord.js';
import {
  Messages,
  MusicCommands,
  players,
} from '@/core/constants/index.constant';
import { COMMAND_MUSIC } from '@/core/commands/music.command';

export default {
  data: COMMAND_MUSIC.skip.data,
  async execute(interaction: any, client: Client) {
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
      console.log(e);
      await interaction.followUp('erro');
    }
  },
};
