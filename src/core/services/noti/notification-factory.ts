import { InputType } from '@/core/types/input-type.type';
import { INotification } from '../../interfaces/notification.interface';
import { MessageNotification } from '@/core/services/noti/message-notification';
import { InteractionNotification } from '@/core/services/noti/interaction-notification';

export class NotificationFactory {
  public static notifier(type: InputType): INotification {
    switch (type) {
      case InputType.DEFAULT:
        return MessageNotification.getInstance();
      case InputType.INTERACTION:
        return InteractionNotification.getInstance();
      case InputType.MESSAGE_COMPONENT:
        return MessageNotification.getInstance();
    }
  }
}
