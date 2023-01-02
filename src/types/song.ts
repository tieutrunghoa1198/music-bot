// Song.ts
export enum Platform {
    YOUTUBE = 'Youtube',
    SOUND_CLOUD = 'SoundCloud',
    SPOTIFY = 'Spotify'
}

export interface Song {
    title: string;
    length: number;
    author: string;
    thumbnail: string;
    url: string;
    platform: Platform;
}
