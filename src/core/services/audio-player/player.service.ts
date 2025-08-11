import { VoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';
import { TextChannel } from 'discord.js';
import { players } from '@/core/constants/common.constant';
import { logger } from '@/core/utils/logger.util';
import { MusicAreaRepository } from '@/core/database/repositories/music-area.repository';
import { Messages } from '@/core/constants/messages.constant';
import { botClient } from '@/bot-client';
import { VoiceConnectionManager } from '@/core/services/audio-player/connection-manager.service';
import { AudioManager } from '@/core/services/audio-player/audio-manager.service';
import { QueueManager } from '@/core/services/audio-player/queue-manager.service';
import { QueueItem } from '@/core/interfaces/player.interface';

export class Player {
  public readonly voiceConnectionManager: VoiceConnectionManager;
  public readonly audioManager: AudioManager;
  public readonly queueManager: QueueManager;

  // -----------------------------

  constructor(
    voiceConnection: VoiceConnection,
    private guildId: string,
    private readonly musicAreaRepository: MusicAreaRepository = new MusicAreaRepository(),
  ) {
    this.voiceConnectionManager = new VoiceConnectionManager(voiceConnection);
    this.audioManager = new AudioManager();
    this.queueManager = new QueueManager(guildId, this.audioManager);

    this.voiceConnectionManager.voiceConnection.subscribe(
      this.audioManager.player,
    );
    this.audioManager.onIdle(async () => {
      await this.queueManager.play(); // if stay here means play next song
      await this.onNextSong({
        nextSong: this.queueManager.currentSong as QueueItem,
        guildId: this.guildId,
      });
    });
  }

  async onNextSong(payload: any) {
    const guildId = payload.guildId;

    if (!payload.nextSong?.song) return;

    try {
      const musicAreaChannel =
        await this.musicAreaRepository.findByGuildId(guildId);

      if (musicAreaChannel === null || musicAreaChannel === undefined) {
        logger.warn('not found music area in this guild, at player.service.ts');
        return;
      }

      const { textChannelId } = musicAreaChannel;
      const messagePayload = {
        title: payload.nextSong.song.title,
        requester: payload.nextSong.requester,
      };

      if (!textChannelId || textChannelId === '') return;

      const textChannel = botClient.channels.cache.get(
        textChannelId,
      ) as TextChannel;

      await textChannel.send(Messages.skippedSong(messagePayload));
    } catch (e) {
      logger.error(e + ' | at player.model | onNextSong()');
    }
  }

  public leave(): void {
    if (
      this.voiceConnectionManager.voiceConnection.state.status !==
      VoiceConnectionStatus.Destroyed
    ) {
      this.voiceConnectionManager.voiceConnection.destroy();
    }

    this.queueManager.stop();
    players.delete(this.guildId);
  }
}
