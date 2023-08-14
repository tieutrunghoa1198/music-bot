import {Platform, Song} from "@/types/song";
import {soundCloudPlaylistRegex, soundCloudTrackRegex} from "@/constants";
import { SoundCloud } from 'scdl-core';
import {Playlist} from "@/types/playlist";
import {soundCloudUrl} from "scdl-core/dist/constants/configs";
import puppeteer, {HTTPRequest} from "puppeteer";
import PuppeteerIntercept from "@/services/others/puppeteer-intercept";
import play from "play-dl";

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

    public async updateToken() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Intercept network requests
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            // Capture the URL of the request
            const requestUrl = request.url();
            console.log('Intercepted request:', requestUrl);
            if (requestUrl.includes('client_id')) {
                play.setToken({
                    soundcloud: {
                        client_id: requestUrl.split('client_id=')[1]
                    }
                })
            }
            // You can also check the request method (GET, POST, etc.) and handle accordingly
            // const requestMethod = request.method();

            // Allow the request to continue
            request.continue();
        });

        try {
            // Navigate to the website you want to capture data from
            await page.goto('https://soundcloud.com');

            // Optionally, perform actions on the page (e.g., click buttons, input data, etc.)
            // ...

            // Wait for a specific condition (e.g., certain content loaded)
            // await page.waitForSelector('.target-element');

            // Capture additional data from the page (if needed)
            // const pageContent = await page.content();
            // console.log('Page content:', pageContent);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            // Close the browser
            await browser.close();
        }
    }
    //
    // private findToken(request: HTTPRequest): void {
    //     const url = request.url();
    //     const found = this.findClientId(url);
    //     console.log(url)
    //
    //     found.length > 0 ? this.setClientId(found) : request.continue();
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
