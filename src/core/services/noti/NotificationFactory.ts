import {InputType} from "@/core/types/input-type.type";
import {INotification} from "../../interfaces/notification.interface";
import {MAP_INPUT_TYPE} from "@/core/types/notification.type";

export class NotificationFactory {
    public static Notifier(type: String): INotification | undefined {
        const notificationType = MAP_INPUT_TYPE.get(type as InputType);

        if (notificationType === undefined) return;

        return notificationType;
    }
}


