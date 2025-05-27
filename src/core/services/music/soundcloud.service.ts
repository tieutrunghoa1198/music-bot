import {Song} from '@/core/types/song.type';
import {soundCloudPlaylistRegex, soundCloudTrackRegex,} from '@/core/constants/index.constant';
import {SoundCloud} from 'scdl-core';
import {Playlist} from '@/core/types/playlist.type';
import {SongDAO} from "@/core/dao/song.dao";

export class SoundCloudService {

  public static async getTrackDetail(content: string): Promise<Song> {
    const paths = content.match(soundCloudTrackRegex);
    const songUrl = paths?.[0] || await this.searchTrack(content);

    if (!songUrl) {
      throw new Error('No valid SoundCloud track URL found.');
    }

    const track = await SoundCloud.tracks.getTrack(songUrl);

    if (!track) {
      throw new Error('Track not found on SoundCloud.');
    }

    return SongDAO.getDetailSC(track, songUrl);
  }

  public static async getPlaylist(url: string): Promise<Playlist> {
    const playlist = await SoundCloud.playlists.getPlaylist(url);

    if (!url || !playlist) {
      throw new Error('Invalid URL or playlist not found.');
    }

    const songs: Song[] = playlist.tracks.map((track) =>
        SongDAO.getDetailSC(track, track.permalink_url)
    );

    return {
      title: `SoundCloud set ${playlist.id}`,
      thumbnail: playlist.artwork_url ?? '',
      author: `${playlist.user?.first_name || ''} ${playlist.user?.last_name || ''}`.trim(),
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
}
