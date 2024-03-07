import {Client} from 'discord.js';
import skipCommand from '@/features/audio-player/cmd-slash/skip.command';
import {BuilderID} from '@/core/constants/music-commands.constant';

export default {
  customId: BuilderID.nextSong,
  execute: async (interaction: any, client: Client) =>
    skipCommand.execute(interaction, client),
};
