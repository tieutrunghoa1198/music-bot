import {Platform, Song} from "../types/song";
import play from 'play-dl';

export class YoutubeService {
    private static mixPlaylist = require('yt-mix-playlist');
    public static async getVideoDetail(content: string): Promise<Song> {
        const video = await play.video_info(content);
        const vid_info = video.video_details;
        return {
            title: vid_info.title as string,
            length: vid_info.durationInSec,
            author: vid_info.channel?.name as string,
            thumbnail: vid_info.thumbnails[0].url,
            url: vid_info.url,
            platform: Platform.YOUTUBE,
        } as Song
    }

    public static async getRandomList(url: string) {
        const videoId = this.extractId(url);
        const result = await this.mixPlaylist(videoId);
        const songs: Song[] = [];
        if (!result) if (!url) throw new Error();
        await result.items.forEach((track: any) => {
            songs.push({
                title: track.title,
                thumbnail: track.thumbnails[0].url ? track.thumbnails[0].url : '',
                author: track.author.name,
                url: track.url,
                length: track.duration / 1000,
                platform: Platform.YOUTUBE,
            });
        })

        return {
            title: `Youtube set ${result.id}`,
            thumbnail: result.thumbnails[0] ? result.thumbnails[0] : '',
            author: `${result._context.collapsedList.author}`,
            songs,
        };
    }

    private static extractId(url: string) {
        const extractWatchUrl = url.split('watch?v=')[1];
        const videoId = extractWatchUrl.split('&list=RD')[0];
        return videoId;
    }
}
