import { Message } from 'discord.js';
import { MusicAreas } from '@/core/mongodb/music-area.model';
import * as Constant from '@/core/constants/index.constant';
import { PlayerService } from '@/core/services/music/player-service.service';

const handleYoutubeLink = async (msg: Message) => {
  const query = MusicAreas.where({ textChannelId: msg.channel.id });
  const musicAreaChannel = await query.findOne();

  if (!(await voiceCondition(msg, musicAreaChannel))) return;
  const input = msg.content;
  const processingMsg = await msg.channel.send(Constant.Messages.processing);
  try {
    await new PlayerService(msg).startPlay(input);
  } catch (e) {
    console.log(e);
    await msg.channel.send(Constant.Messages.error);
  } finally {
    if (processingMsg.deletable) {
      await processingMsg.delete().catch((err: any) => {
        console.log(err);
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
    console.log('not found music area in this guild');
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
