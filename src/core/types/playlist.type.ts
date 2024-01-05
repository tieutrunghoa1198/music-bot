// Playlist.ts
import {Song} from './song.type';

export interface Playlist {
    title: string;
    thumbnail: string;
    author: string;
    songs: Song[];
}
