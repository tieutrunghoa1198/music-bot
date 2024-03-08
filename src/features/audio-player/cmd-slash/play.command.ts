import { SlashCommandBuilder } from '@discordjs/builders';
import { Client } from 'discord.js';
import { YoutubeService } from '@/core/services/music/youtube.service';
import { YouTubeVideo } from 'play-dl';
import { limitString } from '@/core/utils/common.util';
import { PlayerService } from '@/core/services/music/player-service.service';
import { Messages, MusicCommands } from '@/core/constants/index.constant';
import { COMMAND_MUSIC } from '@/core/commands/music.command';

export default {
  hasAutoComplete: COMMAND_MUSIC.play.hasAutoComplete,
  data: COMMAND_MUSIC.play.data,
  async execute(interaction: any, client: Client) {
    await interaction.deferReply();

    const input = interaction.options.getString('input');
    if (input === null) {
      await interaction.followUp(Messages.error);
      return;
    }

    try {
      await new PlayerService(interaction, client).startPlay(input);
    } catch (e) {
      console.log(e);
      await interaction.followUp(Messages.error);
    } finally {
      interaction.deletable && (await interaction.deleteReply());
    }
  },
  async autocomplete(interaction: any, client: Client) {
    try {
      const input = interaction.options.getString('input');
      const results = await YoutubeService.search(input);
      await interaction.respond(
        results.map((choice: YouTubeVideo) => ({
          name:
            limitString(choice.title as string, 80) +
            ' | ' +
            limitString(choice.durationRaw, 10),
          value: choice.url,
        })),
      );
    } catch (e) {
      await interaction.respond([
        {
          name: 'Không tìm thấy kết quả',
          value: '',
        },
      ]);
    }
  },
};
