import {Platform, Song} from "../types/song";

export class YoutubeService {
    public static async getVideoDetail(content: string): Promise<Song> {



        return {
            title: 'string',
            length: 0,
            author: 'string',
            thumbnail: 'string',
            url: 'string',
            platform: Platform.YOUTUBE,
        }
    }
}
