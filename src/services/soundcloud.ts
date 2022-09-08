import {Platform, Song} from "../types/song";

export class SoundCloudService {
    public static async getTrackDetail(content: string): Promise<Song> {
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