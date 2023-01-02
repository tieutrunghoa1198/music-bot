import play, {SpotifyPlaylist, SpotifyTrack} from "play-dl";
import {Platform, Song} from "../types/song";
import {YouTubeVideo} from "play-dl";
export class SpotifyService {
    public static async getUrlInfo(url: string) {
        let track = await play.spotify(url);
        switch (track.type) {
            case "playlist":
                track = track as SpotifyPlaylist;
                // @ts-ignore
                const allTracks = await track.all_tracks();
                const songs: Song[] = [];
                for (track of allTracks) {
                    await play.search(
                        track.name,
                        {source: {youtube: "video"}}
                        //@ts-ignore
                    ).then(async (tracks: YouTubeVideo[]) => {
                        console.log('[PROCESS]: getting video from youtube')
                        songs.push({
                            title: tracks[0].title as string,
                            length: tracks[0].durationInSec,
                            //@ts-ignore
                            author: tracks[0].channel.name as string || '',
                            //@ts-ignore
                            thumbnail: tracks[0].thumbnails[0].url || '',
                            url: tracks[0].url,
                            platform: Platform.YOUTUBE,
                        })
                    }).catch(err => {
                        console.log(err, 'cant get spotify')
                    })
                }
                return songs;
                break;
            case "track":
                console.log('not supported yet track')
                break;
            case "album":
                console.log('not supported yet album')
                break;
        }
    }

    private static handleTrack() {

    }

    private static handlePlaylist() {

    }
}
