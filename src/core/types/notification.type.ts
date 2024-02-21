import {InputType} from "@/core/types/input-type.type";
import {INotification} from "@/core/interfaces/notification.interface";
import {MessageNotification} from "@/core/services/noti/message-notification";
import {InteractionNotification} from "@/core/services/noti/interaction-notification";

// todo: should move this to common file with
export const MAP_INPUT_TYPE = new Map<InputType, INotification>([
    [InputType.MESSAGE_COMPONENT, MessageNotification.getInstance()],
    [InputType.INTERACTION, InteractionNotification.getInstance()],
    [InputType.DEFAULT, MessageNotification.getInstance()],
]);