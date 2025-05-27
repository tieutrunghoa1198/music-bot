import {Platform, Song} from "@/core/types/song.type";
import {Track} from "scdl-core";
import {YouTubeVideo} from "play-dl";

export class SongDAO {
    static getDetailSC = (track: Track, songUrl: string): Song => ({
        title: track.title,
        length: track.duration / 1000,
        author: track.user?.username || 'Unknown',
        thumbnail: track.artwork_url ?? '',
        url: songUrl,
        platform: Platform.SOUND_CLOUD,
    })

    static getDetailYT = (vid_info: YouTubeVideo): Song => ({
        title: vid_info.title as string,
        length: vid_info.durationInSec,
        author: vid_info.channel?.name as string,
        thumbnail: vid_info.thumbnails[0].url,
        url: vid_info.url,
        platform: Platform.YOUTUBE,
    })
}