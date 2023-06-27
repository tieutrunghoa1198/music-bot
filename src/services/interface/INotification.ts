import {Player, QueueItem} from "../../mvc/models/player";

export interface INotification {
    showNowPlaying(player: Player, userInteraction: any, queueItem: QueueItem): void,
    showQueue(userInteraction: any, player: Player): void,
    defaultError(userInteraction: any): void
}
