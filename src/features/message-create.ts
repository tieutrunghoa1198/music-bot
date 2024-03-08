import { Message } from 'discord.js';
import MessageMusicController from '@/features/audio-player/cmd-message/play.msg';
import MessageRestrictController from './moderating-message/cmd-message/restrict.msg';
import { botClient } from '@/bot-client';

export const MessageCreate = async () => {
  botClient.on('messageCreate', async (msg: Message) => {
    await MessageRestrictController.restrict(msg);
    await MessageMusicController.handleLink(msg);
  });
};
