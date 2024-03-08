import * as Constant from '@/core/constants/index.constant';
import { Song } from '@/core/types/song.type';
import { YoutubeService } from '@/core/services/music/youtube.service';
import { SoundCloudService } from '@/core/services/music/soundcloud.service';

export const MAP_LINK_TYPE = new Map<
  Constant.Link,
  (url: string) => Promise<Song[]>
>([
  [
    Constant.Link.YoutubeTrack,
    async (url) => {
      return [await YoutubeService.getVideoDetail(url)];
    },
  ],
  [
    Constant.Link.YoutubeRandomList,
    async (url) => {
      const { songs } = await YoutubeService.getRandomList(url);
      return songs;
    },
  ],
  [
    Constant.Link.SoundCloudTrack,
    async (url) => {
      return [await SoundCloudService.getTrackDetail(url)];
    },
  ],
  [
    Constant.Link.SoundCloudPlaylist,
    async (url) => {
      const { songs } = await SoundCloudService.getPlaylist(url);
      return songs;
    },
  ],
]);
