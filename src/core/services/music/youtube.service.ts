import { Platform, Song } from '@/core/types/song.type';
import play from 'play-dl';
import { SongUtil } from '@/core/utils/song.util';

export class YoutubeService {
  private static mixPlaylist = require('yt-mix-playlist');

  public static async search(content: string, limit: number = 5): Promise<[]> {
    if (content === '') return [];
    const searched = await play.search(content, {
      source: { youtube: 'video' },
      limit,
    });
    return searched as [];
  }

  public static async getVideoDetail(content: string): Promise<Song> {
    const video = await play.video_info(content);
    const vid_info = video.video_details;
    return SongUtil.getDetailYT(vid_info);
  }

  public static async getRandomList(url: string) {
    const videoId = this.extractId(url);
    const result = await this.mixPlaylist(videoId);
    const songs: Song[] = [];
    if (!result) if (!url) throw new Error();
    if (!result?.items) throw new Error('Mix playlist is invalid!');
    await result.items.forEach((track: any) => {
      const rawDuration = track.duration.split(':');
      let hours = 0;
      let minutes: number;
      let seconds: number;
      let result: number;
      if (rawDuration.length === 3) {
        hours = parseInt(rawDuration[0]);
        minutes = parseInt(rawDuration[1]);
        seconds = parseInt(rawDuration[2]);
        result = hours * 3600 + minutes * 60 + seconds;
      } else {
        minutes = parseInt(rawDuration[0]);
        seconds = parseInt(rawDuration[1]);
        result = minutes * 60 + seconds;
      }

      songs.push({
        title: track.title,
        thumbnail: track.thumbnails[0].url ? track.thumbnails[0].url : '',
        author: track.author.name,
        url: track.url,
        length: result,
        platform: Platform.YOUTUBE,
      });
    });

    return {
      title: `Youtube set ${result.id}`,
      thumbnail: result.thumbnails[0] ? result.thumbnails[0] : '',
      author: `${result._context.collapsedList.author}`,
      songs,
    };
  }

  private static extractId(url: string) {
    const extractWatchUrl = url.split('watch?v=')[1];
    return extractWatchUrl.split('&list=RD')[0];
  }
}
