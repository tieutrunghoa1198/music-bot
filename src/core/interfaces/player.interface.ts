import { AudioPlayer, VoiceConnection } from '@discordjs/voice';
import { Song } from '@/core/types/song.type';
import { SoundCloudStream, YouTubeStream } from 'play-dl';

export interface IPlayer {
  guildId: string;
  playing?: QueueItem;
  queue: QueueItem[];
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
}
export interface QueueItem {
  song: Song;
  requester: string;
  stream?: YouTubeStream | SoundCloudStream;
}
