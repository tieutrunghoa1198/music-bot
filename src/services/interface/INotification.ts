import {Player} from "../../models/player";
import {QueueItem} from "../../models/abstractPlayer";

export interface INotification {
    showNowPlaying(player: Player, userInteraction: any, queueItem: QueueItem): void,
    showQueue(userInteraction: any, player: Player): void,
    defaultError(userInteraction: any): void
}
