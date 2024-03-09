export interface INotification {
  showNowPlaying(userInteraction: any): void;
  showQueue(userInteraction: any): void;
  defaultError(userInteraction: any): void;
}
