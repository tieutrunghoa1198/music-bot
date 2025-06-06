import { Message } from 'discord.js';
import { MusicAreas } from '@/core/mongodb/music-area.model';
import * as Constant from '@/core/constants/index.constant';
import { UrlService } from '@/core/services/music/url.service';
import {logger} from "@/core/utils/logger.util";

const handleYoutubeLink = async (msg: Message) => {
  const query = MusicAreas.where({ textChannelId: msg.channel.id });
  const musicAreaChannel = await query.findOne();

  if (!(await voiceCondition(msg, musicAreaChannel))) return;
  const input = msg.content;
  const processingMsg = await msg.channel.send(Constant.Messages.processing);
  try {
    await new UrlService(msg).startPlay(input);
  } catch (e) {
    logger.error(e);
    await msg.channel.send(Constant.Messages.error);
  } finally {
    if (processingMsg.deletable) {
      await processingMsg.delete().catch((err: any) => {
        logger.error(err);
      });
    }
  }
};

const voiceCondition = async (
  msg: any,
  musicAreaChannel: any,
): Promise<boolean> => {
  const input = msg.content;

  if (!input.startsWith('http')) {
    return false;
  }
  if (musicAreaChannel === null || musicAreaChannel === undefined) {
    logger.warn('not found music area in this guild, at play.msg.ts');
    return false;
  }

  const voiceChannel = msg.member?.voice.channel;
  if (!voiceChannel) {
    await msg.channel.send(
      Constant.Messages.userJoinVoiceChannel(msg.author.toString()),
    );
    return false;
  }
  return true;
};
export default {
  handleLink: handleYoutubeLink,
};
