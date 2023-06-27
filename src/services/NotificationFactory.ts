import {InputType} from "../types/InputType";
import {MessageNotification} from "./MessageNotification";
import {InteractionNotification} from "./InteractionNotification";
import {INotification} from "./interface/INotification";

export class NotificationFactory {
    public static Notifier(type: String): INotification {
        let notification: any = null
        switch (type) {
            case InputType.MESSAGE:
                notification = MessageNotification.getInstance();
                break;
            case InputType.INTERACTION:
                notification = InteractionNotification.getInstance();
                break;
        }
        return notification;
    }
}
