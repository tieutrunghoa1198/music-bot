import {Song} from '@/core/types/song.type';
import {SoundCloudStream, YouTubeStream} from 'play-dl';

export interface QueueItem {
  song: Song;
  requester: string;
  stream?: YouTubeStream | SoundCloudStream;
}
