import play, {SoundCloudTrack, SpotifyPlaylist, SpotifyTrack, YouTubeVideo} from "play-dl";
import {Platform, Song} from "@/types/song";
import {exactMatch} from "@/utils/common";

export class SpotifyService {
    public static async getTrack(url: string) {
        let track = await play.spotify(url) as SpotifyTrack;
        const searchString = track.name + ' ' + track.artists[0].name;
        const ytTracks = await play.search(
            searchString,
            {source: {youtube: "video"}}
        )
        const matchString = exactMatch(searchString, ytTracks[0].title);
        if (matchString[0].length < searchString.length/2) {
            return await this.getTrackBySC(searchString);
        } else {
            return await this.getTrackByYT(searchString);
        }
    }

    public static async getTrackByYT(input: string): Promise<Song> {
        return await play.search(input, {source: {youtube: "video"}})
            .then((tracks: YouTubeVideo[]) => {
                console.log(`[PROCESS]: Get ${tracks[0].title} from ${Platform.YOUTUBE}...`);
                return {
                    title: tracks[0].title as string,
                    length: tracks[0].durationInSec,
                    //@ts-ignore
                    author: tracks[0].channel.name as string || 'Unknown',
                    //@ts-ignore
                    thumbnail: tracks[0].thumbnails[0].url || '',
                    url: tracks[0].url,
                    platform: Platform.YOUTUBE,
                }
            })
    }

    private static async getTrackBySC(input: string): Promise<Song> {
        return await play.search(input, {source: {soundcloud: "tracks"}})
            .then((tracks: SoundCloudTrack[]) => {
                console.log(`[PROCESS]: Get ${tracks[0].name} from ${Platform.SOUND_CLOUD}...`);
                return {
                    title: tracks[0].name as string,
                    length: tracks[0].durationInSec,
                    //@ts-ignore
                    author: tracks[0].user.name as string || 'Unknown',
                    //@ts-ignore
                    thumbnail: tracks[0].thumbnail || '',
                    url: tracks[0].url,
                    platform: Platform.SOUND_CLOUD,
                }
            })
    }
    public static async getUrlInfo(url: string) {
        let track = await play.spotify(url);
        switch (track.type) {
            case "playlist":
                track = track as SpotifyPlaylist;
                // @ts-ignore
                const allTracks = await track.all_tracks();
                const songs: Song[] = [];
                for (track of allTracks) {
                    const song = await this.getTrackByYT(track.name);
                    songs.push(song)
                }
                return songs;
        }
    }

    private static handleTrack() {

    }

    private static handlePlaylist() {

    }
}
