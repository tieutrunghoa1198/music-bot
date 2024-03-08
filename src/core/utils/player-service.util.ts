import { Player } from '@/core/models/player.model';
import {
  entersState,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { logger } from '@/core/utils/logger.util';
import { players } from '@/core/constants/common.constant';
import { botClient } from '@/botClient';

export const enterReadyState = async (player: Player) => {
  try {
    await entersState(
      <VoiceConnection>player?.voiceConnection,
      VoiceConnectionStatus.Ready,
      10e3,
    );
  } catch (e) {
    logger.error(e);
  }
};

export const createPlayer = (interactObj: any) => {
  let player = players.get(interactObj.guildId as string) as Player;

  if (player) return player;

  const channel = interactObj.member.voice.channel;
  player = new Player(
    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    }),
    interactObj.guildId as string,
    botClient,
  );
  players.set(interactObj.guildId as string, player);

  return player;
};
