import { SlashCommandBuilder } from '@discordjs/builders';
import { MusicCommands } from '@/core/constants/music-commands.constant';

export const COMMAND_MUSIC = {
  clearQueue: {
    data: new SlashCommandBuilder()
      .setName(MusicCommands.clear.name)
      .setDescription(MusicCommands.clear.description)
      .setDMPermission(false)
      .toJSON(),
  },

  leave: {
    data: new SlashCommandBuilder()
      .setName(MusicCommands.leave.name)
      .setDescription(MusicCommands.leave.description)
      .setDMPermission(false)
      .toJSON(),
  },

  nowPlaying: {
    data: new SlashCommandBuilder()
      .setName(MusicCommands.nowPlaying.name)
      .setDescription(MusicCommands.nowPlaying.description)
      .setDMPermission(false)
      .toJSON(),
  },

  pause: {
    data: new SlashCommandBuilder()
      .setName(MusicCommands.pause.name)
      .setDescription(MusicCommands.pause.description)
      .setDMPermission(false)
      .toJSON(),
  },

  play: {
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
      )
      .toJSON(),
  },

  replay: {
    data: new SlashCommandBuilder()
      .setName(MusicCommands.replay.name)
      .setDescription(MusicCommands.replay.description)
      .setDMPermission(false)
      .addStringOption((option) =>
        option
          .setName('replay')
          .setDescription('on/off')
          .setRequired(true)
          .addChoices(
            { name: 'Bật', value: 'true' },
            { name: 'Tắt', value: 'false' },
          ),
      )
      .toJSON(),
  },

  resume: {
    data: new SlashCommandBuilder()
      .setName(MusicCommands.resume.name)
      .setDescription(MusicCommands.resume.description)
      .setDMPermission(false)
      .toJSON(),
  },

  showList: {
    data: new SlashCommandBuilder()
      .setName(MusicCommands.listQueue.name)
      .setDescription(MusicCommands.listQueue.description)
      .setDMPermission(false)
      .toJSON(),
  },

  skip: {
    data: new SlashCommandBuilder()
      .setName(MusicCommands.skip.name)
      .setDescription(MusicCommands.skip.description)
      .setDMPermission(false)
      .toJSON(),
  },
};
