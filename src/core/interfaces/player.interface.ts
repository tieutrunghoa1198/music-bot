import { AudioPlayer, VoiceConnection } from '@discordjs/voice';
import { Song } from '@/core/types/song.type';

export interface IPlayer {
  guildId: string;
  playing?: QueueItem;
  queue: QueueItem[];
  message: any;
  textChannel: any;
  readonly voiceConnection: VoiceConnection;
  readonly audioPlayer: AudioPlayer;
  addSong(queueItems: QueueItem[]): void;
  stop(): void;
  leave(): void;
  skip(): void;
  skipByTitle(title: string): void;
  pause(): void;
  resume(): void;
  play(): void;
  jump(position: number): Promise<QueueItem>;
}
export interface QueueItem {
  song: Song;
  requester: string;
}
