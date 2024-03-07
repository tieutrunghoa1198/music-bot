import {Client, Message} from 'discord.js';
import MessageMusicController from '@/features/audio-player/cmd-message/play.msg';
import MessageRestrictController from './moderating-message/cmd-message/restrict.msg';

export const MessageCreate = async (client: Client) => {
  client.on('messageCreate', async (msg: Message) => {
    await MessageRestrictController.restrict(msg, client);
    await MessageMusicController.handleLink(msg, client);
  });
};
