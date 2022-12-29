import {Platform, Song} from "../types/song";
import play from 'play-dl'
export class YoutubeService {
    public static async getVideoDetail(content: string): Promise<Song> {
        const video = await play.video_info(content);
        const vid_info = video.video_details;
        return {
            title: vid_info.title as string,
            length: vid_info.durationInSec,
            author: vid_info.channel?.name as string,
            thumbnail: 'string',
            url: vid_info.url,
            platform: Platform.YOUTUBE,
        }
    }
}
