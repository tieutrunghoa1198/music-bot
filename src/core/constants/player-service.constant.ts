import * as Constant from '@/core/constants/index.constant';
import { Song } from '@/core/types/song.type';
import { YoutubeService } from '@/core/services/music/youtube.service';

export const MAP_LINK_TYPE = new Map<
  Constant.Link,
  (url: string) => Promise<Song[]>
>([
  [
    Constant.Link.YoutubeTrack,
    async (url) => {
      const song = await YoutubeService.getVideoDetail(url);
      return [song];
    },
  ],
  [
    Constant.Link.YoutubeRandomList,
    async (url) => {
      const { songs } = await YoutubeService.getRandomList(url);
      return songs;
    },
  ],
]);
