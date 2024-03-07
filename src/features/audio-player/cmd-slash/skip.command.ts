import { SlashCommandBuilder } from '@discordjs/builders';
import { Client } from 'discord.js';
import {
  Messages,
  MusicCommands,
  players,
} from '@/core/constants/index.constant';

export default {
  data: new SlashCommandBuilder()
    .setName(MusicCommands.skip.name)
    .setDescription(MusicCommands.skip.description)
    .setDMPermission(false),
  async execute(interaction: any, client: Client) {
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
