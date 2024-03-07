import { Player } from '@/core/models/player.model';

export interface INotification {
  showNowPlaying(player: Player, userInteraction: any): void;
  showQueue(player: Player, userInteraction: any): void;
  defaultError(userInteraction: any): void;
}
