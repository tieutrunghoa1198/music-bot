import { YoutubeService } from '@/core/services/music/youtube.service';
import { YouTubeVideo } from 'play-dl';
import { limitString } from '@/core/utils/common.util';
import { PlayerService } from '@/core/services/music/player-service.service';
import { Messages, MusicCommands } from '@/core/constants/index.constant';
import { ICommand } from '@/features/audio-player/interfaces/command.interface';
import { SlashCommandBuilder } from '@discordjs/builders';

export const playCommand: ICommand = {
  hasAutoComplete: true,
  data: new SlashCommandBuilder()
    .setName(MusicCommands.play.name)
    .setDescription(MusicCommands.play.description)
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('input')
        .setDescription('Link to be played')
        .setRequired(true)
        .setAutocomplete(true),
    ),
  async execute(interaction: any) {
    await interaction.deferReply();

    const input = interaction.options.getString('input');
    if (input === null) {
      await interaction.followUp(Messages.error);
      return;
    }

    try {
      await new PlayerService(interaction).startPlay(input);
    } catch (e) {
      console.log(e);
      await interaction.followUp(Messages.error);
    } finally {
      interaction.deletable && (await interaction.deleteReply());
    }
  },
  async autocomplete(interaction: any) {
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
