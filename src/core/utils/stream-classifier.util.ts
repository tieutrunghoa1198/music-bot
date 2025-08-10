import { IStream } from '@/core/interfaces/stream.interface';
import { Link } from '@/core/constants/link.constant';
import { SoundcloudStream } from '@/core/services/music/soundcloud-stream.service';
import { YoutubeStream } from '@/core/services/music/youtube-stream.service';

export class StreamClassifier {
  public stream: IStream;

  constructor(url: string) {
    switch (url) {
      case Link.SoundCloudPlaylist:
      case Link.SoundCloudTrack: {
        this.stream = new SoundcloudStream();
        break;
      }

      case Link.YoutubeTrack:
      case Link.YoutubeRandomList: {
        this.stream = new YoutubeStream();
        break;
      }

      default: {
        this.stream = new SoundcloudStream();
      }
    }
  }
}
