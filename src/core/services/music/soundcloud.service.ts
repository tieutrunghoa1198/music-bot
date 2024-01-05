import {Platform, Song} from "@/core/types/song.type";
import {soundCloudPlaylistRegex, soundCloudTrackRegex} from "@/core/constants/index.constant";
import {SoundCloud} from 'scdl-core';
import {Playlist} from "@/core/types/playlist.type";

export class SoundCloudService {
    public static async download(url: string, highWaterMark: number) {
        return await SoundCloud.download(url, { highWaterMark });
    }

    public static async getTrackDetail(content: string): Promise<Song> {
        let url = '';
        const paths = content.match(soundCloudTrackRegex);
        if (!paths) {
            url = await this.searchTrack(content);
        } else {
            url = paths[0];
        }

        if (!url) throw new Error();
        const track = await SoundCloud.tracks.getTrack(url);
        if (track) {
            return {
                title: track.title,
                length: track.duration / 1000,
                author: track.user.username,
                thumbnail: track.artwork_url ? track.artwork_url : '',
                url,
                platform: Platform.SOUND_CLOUD,
            }
        }
        throw new Error();
    }

    public static async getPlaylist(url: string): Promise<Playlist> {
        const playlist = await SoundCloud.playlists.getPlaylist(url);
        if (!playlist) if (!url) throw new Error();
        const songs: Song[] = [];
        playlist.tracks.forEach((track) => {
            songs.push({
                title: track.title,
                thumbnail: track.artwork_url ? track.artwork_url : '',
                author: track.user.username,
                url: track.permalink_url,
                length: track.duration / 1000,
                platform: Platform.SOUND_CLOUD,
            });
        });

        return {
            title: `SoundCloud set ${playlist.id}`,
            thumbnail: playlist.artwork_url ? playlist.artwork_url : '',
            author: `${playlist.user.first_name} ${playlist.user.last_name}`,
            songs,
        };
    }

    public static isPlaylist(url: string): string | null {
        const paths = url.match(soundCloudPlaylistRegex);
        if (paths) return paths[0];
        return null;
    }

    private static async searchTrack(keyword: string): Promise<string> {
        const res = await SoundCloud.search({
            query: keyword,
            filter: 'tracks',
        });

        if (res.collection.length > 0) {
            return res.collection[0].permalink_url;
        }
        return '';
    }

    // public async updateToken() {
    //     const puppeteer = new PuppeteerIntercept();
    //
    //     // await puppeteer.onRequest(this.findToken)
    //     // await puppeteer.sendRequest(soundCloudUrl, this.findToken);
    // }
    //
    // public findToken(request: HTTPRequest): void {
    //     console.log('asd asd asd ')
    //     const url = request.url();
    //     console.log(request)
    //     const found = this.findClientId(url);
    //     if (url.includes('client_id')) {
    //         play.setToken({
    //             soundcloud: {
    //                 client_id: url.split('client_id=')[1]
    //             }
    //         })
    //     }
    //     console.log(url)
    //     request.continue();
    //     // found.length > 0 ? this.setClientId(found) : request.continue();
    // }
    //
    // private setClientId(url: string): string {
    //     return '';
    // }
    //
    // private findClientId(url: string): string {
    //     console.log('Intercept', url);
    //     return '';
    // }

}
